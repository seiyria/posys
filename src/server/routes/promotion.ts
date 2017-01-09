/* tslint:disable:only-arrow-functions no-invalid-this */

import * as _ from 'lodash';

import { bookshelf } from '../server';

import { Promotion } from '../orm/promotion';
import { PromoItem } from '../orm/promoitem';

import { Promotion as PromotionModel } from '../../client/models/promotion';
import { StockItem as StockItemModel } from '../../client/models/stockitem';

import { Logger } from '../logger';
import Settings from './_settings';
import { recordAuditMessage, recordErrorMessageFromServer, MESSAGE_CATEGORIES } from './_logging';

// used when figuring out SetTo promotions
// thanks http://stackoverflow.com/a/38925164/926845
const fill = x=> y=> (new Array(y)).fill(x);

const quotrem = x=> y=> [Math.floor(y/x), Math.floor(y % x)];

const distribute = p=> d=> n=> {
  let e = Math.pow(10,p);
  let [q,r] = quotrem(d)(n*e);
  return fill((q+1)/e)(r).concat(fill(q/e)(d-r))
};

const calculatePromotionDiscount = (promo: PromotionModel, validItems: StockItemModel[], otherPromos?: any[]) => {

  let discount = 0;
  let affectedSKUs = [];
  let affectedItems = [];
  let applyId = '';
  const itemsSortedByPrice = _.sortBy(validItems, 'cost').reverse();

  if(promo.itemReductionType === 'All') {
    if(promo.discountType === 'Dollar') {
      discount = promo.discountValue;

    } else {
      const thisItem = itemsSortedByPrice[0];
      discount = thisItem.cost * (promo.discountValue / 100);
      affectedItems.push(thisItem);
    }

    affectedSKUs = [itemsSortedByPrice[0].sku];

  } else if(promo.itemReductionType === 'BuyXGetNext') {
    const priceComparator = itemsSortedByPrice[0];
    const otherItems = _.takeRight(itemsSortedByPrice, promo.numItemsRequired);
    affectedItems = [priceComparator, ...otherItems];

    if(promo.discountType === 'Dollar') {
      discount = promo.discountValue;

    } else {
      discount = Math.min(priceComparator.cost, _.last(otherItems).cost * (promo.discountValue / 100));
    }

    affectedSKUs = _.map(affectedItems, 'sku');

  } else if(promo.itemReductionType === 'SetTo') {

    const itemsAppliedTo = _.filter(validItems, item => {
      return _.find(otherPromos, promo => promo.applyId === item.promoApplyId);
    });

    const nextPrice = itemsAppliedTo.length;
    const basePrices = distribute(2)(promo.numItemsRequired)(promo.discountValue).reverse();

    const allPrices = _.flatten(fill(basePrices)(promo.numItemsRequired));

    const chosenItem = validItems[nextPrice];

    affectedItems = [chosenItem];
    discount = chosenItem.cost - allPrices[nextPrice];
    affectedSKUs = [chosenItem.sku];
  }

  applyId = _.last(affectedItems).promoApplyId;

  return { discount, affectedSKUs, affectedItems, applyId };
};

const numPromoApplications = (promo: PromotionModel, transactionItems: StockItemModel[]) => {

  const numItemsRequired = promo.itemReductionType === 'BuyXGetNext' ? promo.numItemsRequired + 1 : promo.numItemsRequired;
  const promoItemSKU = _.map(promo.promoItems, 'sku');

  let validItems: StockItemModel[] = [];

  if(promo.discountGrouping === 'Category') {
    validItems = _.filter(transactionItems, item => item.organizationalunitId === promo.organizationalunitId);
  } else {
    validItems = _.filter(transactionItems, item => _.includes(promoItemSKU, item.sku));
  }

  // splat them out into quantity of 1 to make it easier to process them as separate items
  validItems = _.flatten(_.map(validItems, item => {
    return _.map(new Array(item.quantity), () => _.cloneDeep(item));
  }));

  let numApplications = 0;
  const totalGroups = Math.floor(validItems.length / numItemsRequired);

  if(promo.itemReductionType === 'SetTo') {
    numApplications = totalGroups * numItemsRequired;
    validItems.length = numApplications;

  } else {
    numApplications = totalGroups;
  }

  return { numApplications, validItems };
};

export default (app) => {
  app.get('/promotion', (req, res) => {

    const pageOpts = {
      pageSize: +req.query.pageSize || Settings.pagination.pageSize,
      page: +req.query.page || 1,
      withRelated: ['organizationalunit', 'promoItems']
    };

    const hideCurrent = +req.query.hideCurrent;
    const hideFuture  = +req.query.hideFuture;
    const hidePast    = +req.query.hidePast;

    Promotion
      .forge()
      .query(qb => {
        const now = new Date();

        if(hideCurrent) {
          qb
            .andWhere(function() {
              return this
                .where('startDate', '>', now)
                .orWhere('endDate', '<', now);
            });
        }

        if(hideFuture) {
          qb
            .andWhere('startDate', '<', now);
        }

        if(hidePast) {
          qb
            .andWhere('endDate', '>', now);
        }
      })
      .orderBy('startDate')
      .orderBy('endDate')
      .orderBy('name')
      .fetchPage(pageOpts)
      .then(collection => {
        res.json({ items: collection.toJSON(), pagination: collection.pagination });
      })
      .catch(e => {
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.PROMOTION, e);
        res.status(500).json(Logger.browserError(Logger.error('Route:Promotion:GET', e)));
      });
  });

  app.put('/promotion', (req, res) => {

    const promo = new PromotionModel(req.body);
    const items = promo.promoItems || [];
    delete promo.promoItems;

    bookshelf.transaction(t => {
      Promotion
        .forge()
        .save(promo, { transacting: t })
        .then(newPromo => {
          return Promise
            .all(_.map(items, (i: any) => {
              i.promoId = newPromo.id;
              return PromoItem.forge().save(i, { transacting: t });
            }))
            .then(t.commit, t.rollback)
            .then(() => {
              recordAuditMessage(req, MESSAGE_CATEGORIES.PROMOTION, `A new promotion was added (${newPromo.name}).`, { id: newPromo.id });
              res.json({ flash: `Created new promotion successfully`, data: newPromo });
            })
            .catch(e => {
              recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.PROMOTION, e);
              res.status(500).json({ formErrors: e.data || [] });
            });
        })
        .catch(e => {
          recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.PROMOTION, e);
          res.status(500).json({ formErrors: e.data || [] });
        });
    });
  });

  app.post('/promotion/temporary', (req, res) => {
    const { promo, item } = req.body;
    const { discount, applyId } = calculatePromotionDiscount(promo, [item]);

    const tempPromo = {
      promo: new PromotionModel(promo),
      skus: [item.sku],
      totalDiscount: -discount,
      applyId
    };

    recordAuditMessage(req,
      MESSAGE_CATEGORIES.PROMOTION,
      `A temporary promotion was added (${tempPromo.promo.name}).`,
      { id: item.id, item: tempPromo });

    res.json(tempPromo);

  });

  app.post('/promotion/check', (req, res) => {

    const now = new Date();
    const items = req.body;

    Promotion
      .forge()
      .query(qb => {
        qb
          .andWhere('startDate', '<=', now)
          .andWhere('endDate', '>=', now);
      })
      .fetchAll({
        withRelated: ['organizationalunit', 'promoItems']
      })
      .then(promoModels => {
        const promos: PromotionModel[] = promoModels.toJSON();

        const promoApplicationData = _.compact(_.flatten(_.map(promos, promo => {
          const { numApplications, validItems } = numPromoApplications(promo, items);
          if(numApplications < 1) { return []; }

          const allPromos = _.map(new Array(numApplications), () => ({ promo, skus: [], totalDiscount: 0, applyId: '' }));
          let itemClone = _.cloneDeep(validItems);

          _.each(allPromos, promoContainer => {
            const { discount, affectedItems, affectedSKUs, applyId } = calculatePromotionDiscount(promoContainer.promo, itemClone, allPromos);

            if(affectedItems.length > 0 && promoContainer.promo.itemReductionType !== 'SetTo') {
              itemClone = _.reject(itemClone, item => _.includes(affectedItems, item));
            }

            promoContainer.skus = affectedSKUs;
            promoContainer.totalDiscount = -discount;
            promoContainer.applyId = applyId;
          });

          return allPromos;
        })));

        res.json(promoApplicationData);
      })
      .catch(e => {
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.PROMOTION, e);
        res.status(500).json(Logger.browserError(Logger.error('Route:Promotion/check:POST', e)));
      });
  });

  app.get('/promotion/:id', (req, res) => {
    Promotion
      .forge({ id: req.params.id })
      .fetch({
        withRelated: ['organizationalunit', 'promoItems']
      })
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.PROMOTION, e);
        res.status(500).json(Logger.browserError(Logger.error('Route:Promotion/:id:GET', e)));
      });
  });

  app.patch('/promotion/:id', (req, res) => {

    const promo = new PromotionModel(req.body);
    const items = promo.promoItems;
    delete promo.promoItems;
    delete promo.organizationalunit;

    bookshelf.transaction(t => {
      PromoItem
        .query(qb => {
          qb
            .where({ promoId: req.params.id });
        })
        .destroy({ transacting: t })
        .then(() => {
          return Promotion
            .forge()
            .save(promo, { transacting: t, patch: true })
            .then(item => {
              return Promise
                .all(_.map(items, (i: any) => {
                  i.promoId = item.id;
                  delete i.id;
                  return PromoItem.forge().save(i, { transacting: t });
                }))
                .then(t.commit, t.rollback)
                .then(() => {
                  recordAuditMessage(req, MESSAGE_CATEGORIES.PROMOTION, `A promotion was changed (${promo.name}).`, { id: +req.params.id });
                  res.json({ flash: `Updated promotion "${promo.name}"`, data: item });
                });
            })
            .catch(e => {
              recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.PROMOTION, e);
              res.status(500).json({ formErrors: e.data || [] });
            });
        })
        .catch(e => {
          recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.PROMOTION, e);
          const errorMessage = Logger.parseDatabaseError(e, 'Item');
          res.status(500).json({ flash: errorMessage });
        });
    });
  });

  app.delete('/promotion/:id', (req, res) => {

    bookshelf.transaction(t => {
      PromoItem
        .query(qb => {
          qb
            .where({ promoId: req.params.id });
        })
        .destroy({ transacting: t })
        .then(() => {
          return Promotion
            .forge({ id: req.params.id })
            .destroy({ transacting: t })
              .then(t.commit, t.rollback)
              .then(() => {
                recordAuditMessage(req,
                  MESSAGE_CATEGORIES.PROMOTION,
                  `A promotion was removed.`,
                  { id: +req.params.id, oldId: +req.params.id });
                res.json({ flash: `Removed promotion successfully.` });
            });
        })
        .catch(e => {
          recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.PROMOTION, e);
          const errorMessage = Logger.parseDatabaseError(e, 'Item');
          res.status(500).json({ flash: errorMessage });
        });
    });
  });
};
