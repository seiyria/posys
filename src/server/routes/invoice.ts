/* tslint:disable:only-arrow-functions no-invalid-this */

import * as _ from 'lodash';

import { bookshelf, knex } from '../server';

import { Invoice } from '../orm/invoice';
import { InvoiceItem } from '../orm/invoiceitem';
import { InvoicePromo } from '../orm/invoicepromo';

import { StockItem as StockItemModel } from '../../client/models/stockitem';
import { Promotion as PromotionModel } from '../../client/models/promotion';
import { InvoiceItem as InvoiceItemModel } from '../../client/models/invoiceitem';
import { InvoicePromo as InvoicePromoModel } from '../../client/models/invoicepromo';

import { Logger } from '../logger';
import Settings from './_settings';

const incrementItems = (items, transaction?) => {
  return _.map(items, (v: number, k: string) => {
    let base = knex('stockitem');
    if(transaction) { base = base.transacting(transaction); }
    return base
      .where('sku', '=', k)
      .increment('quantity', v);
  });
};

const decrementItems = (items, transaction?) => {
  return _.map(items, (v: number, k: string) => {
    let base = knex('stockitem');
    if(transaction) { base = base.transacting(transaction); }
    const query = base
      .where('sku', '=', k)
      .update({
        quantity: knex.raw(`quantity - ${v}`),
        lastSoldAt: new Date()
      });

    return query;
  });
};

const itemsFromInvoiceToStockable = (items) => {
  return _.reduce(items, (prev, cur: StockItemModel) => {
    prev[cur.sku] = prev[cur.sku] || 0;
    prev[cur.sku] += cur.quantity;
    return prev;
  }, {});
};

export default (app) => {

  app.put('/invoice', (req, res) => {

    const invoice = req.body;
    const items = invoice.stockitems;
    const promos = invoice.promotions;

    const locationName = req.header('X-Location');
    const terminalId = req.header('X-Terminal');

    if(!locationName) {
      return res.json({ flash: 'Location name is not specified in system settings. Transaction aborted.' });
    }

    if(!terminalId) {
      return res.json({ flash: 'Terminal id is not specified in system settings. Transaction aborted.' });
    }

    delete invoice.stockitems;
    delete invoice.promotions;

    invoice.locationName = locationName;
    invoice.terminalId = terminalId;

    const errorHandler = (e) => {
      if(res.headersSent) { return; }
      res.status(500).json({ formErrors: e.data || [], flash: 'Transaction failed to complete correctly.' });
    };

    bookshelf.transaction(t => {

      const countMap = itemsFromInvoiceToStockable(items);

      const itemPromises = (newInvoice) => _.map(items, (i: any) => {
        i.invoiceId = newInvoice.id;
        i.stockitemId = i.id;
        delete i.id;

        if(i.temporary) {
          i.stockitemData = new StockItemModel(i);
        }

        return InvoiceItem.forge().save(new InvoiceItemModel(i), { transacting: t }).catch(errorHandler);
      });

      const promoPromises = (newInvoice) => _.map(promos, (i: any) => {

        i.invoiceId = newInvoice.id;
        delete i.id;

        if(i.temporary) {
          i.promoData = new PromotionModel(i);
        }

        const model = new InvoicePromoModel(i);
        delete model.skus;

        return InvoicePromo.forge().save(model, { transacting: t }).catch(errorHandler);
      });

      let otherPromises = [];

      if(!invoice.isOnHold && !invoice.isVoided) {
        if(invoice.isReturned) {
          otherPromises = incrementItems(countMap, t);
        } else {
          otherPromises = decrementItems(countMap, t);
        }
      }

      if(invoice.previousId) {
        otherPromises.push(Invoice.forge({ id: invoice.previousId }).destroy({ transacting: t }));
        delete invoice.previousId;
      }

      Invoice
        .forge()
        .save(invoice, { transacting: t })
        .then(item => {
          return Promise
            .all(itemPromises(item).concat(promoPromises(item)).concat(otherPromises))
            .then(t.commit, t.rollback)
            .then(() => {
              res.json({ flash: `Transaction completed successfully.`, data: item });
            })
            .catch(errorHandler);
        })
        .catch(errorHandler);
    });
  });

  app.get('/invoice', (req, res) => {

    const pageOpts = {
      pageSize: +req.query.pageSize || Settings.pagination.pageSize,
      page: +req.query.page || 1,
      withRelated: ['stockitems', 'promotions', 'stockitems._stockitemData', 'promotions._promoData']
    };

    const earliestDate  = req.query.earliestDate;
    const latestDate    = req.query.latestDate;
    const hideVoided    = +req.query.hideVoided;
    const hideReturns   = +req.query.hideReturns;
    const hideHolds     = +req.query.hideHolds;
    const hideCompleted = +req.query.hideCompleted;

    Invoice
      .forge()
      .query(qb => {
        if(earliestDate) {
          qb.andWhere('purchaseTime', '>=', earliestDate);
        }

        if(latestDate) {
          qb.andWhere('purchaseTime', '<=', latestDate);
        }

        if(hideVoided) {
          qb.andWhere('isVoided', '!=', true);
        }

        if(hideReturns) {
          qb.andWhere('purchaseMethod', '!=', 'Return');
        }

        if(hideHolds) {
          qb.andWhere('isOnHold', '!=', true);
        }

        if(hideCompleted) {
          qb
            .whereNot(function() {
              this
                .where('isVoided', '!=', true)
                .andWhere('isOnHold', '!=', true)
                .andWhere('purchaseMethod', '!=', 'Return');
            });
        }
      })
      .orderBy('-id')
      .fetchPage(pageOpts)
      .then(collection => {
        res.json({ items: collection.toJSON(), pagination: collection.pagination });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Invoice:GET', e)));
      });
  });

  app.post('/invoice/void/:id', (req, res) => {

     Invoice
      .forge({ id: req.params.id })
      .fetch({
        withRelated: ['stockitems', 'promotions', 'stockitems._stockitemData', 'promotions._promoData']
      })
      .then(item => {
        const unwrappedItem = item.toJSON();
        unwrappedItem.isVoided = !unwrappedItem.isVoided;

        const items = _.map(unwrappedItem.stockitems, (innerItem: any) => {
          const itemData = innerItem.stockitemData || innerItem._stockitemData;
          itemData.quantity = innerItem.quantity;
          return itemData;
        });

        const inventoryHash = itemsFromInvoiceToStockable(items);
        let inventoryPromises = [];

        if(unwrappedItem.isVoided) {
          inventoryPromises = incrementItems(inventoryHash);
        } else {
          inventoryPromises = decrementItems(inventoryHash);
        }

        delete unwrappedItem.stockitems;
        delete unwrappedItem.promotions;

        const savePromise = Invoice
          .forge({ id: req.params.id })
          .save(unwrappedItem, { patch: true })
          .catch(e => {
            res.status(500).json(Logger.browserError(Logger.error('Route:Invoice/:id/void:POST', e)));
          });

        Promise.all([savePromise].concat(inventoryPromises))
          .then(resolvedPromises => {
            // [0] is the saved item
            res.json(resolvedPromises[0]);
          });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Invoice/:id/void:POST', e)));
      });
  });

};
