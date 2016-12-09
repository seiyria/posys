
import * as _ from 'lodash';

import { bookshelf } from '../server';

import { Promotion } from '../orm/promotion';
import { PromoItem } from '../orm/promoitem';

import { Logger } from '../logger';
import Settings from './_settings';

export default (app) => {
  app.get('/promotion', (req, res) => {

    const pageOpts = {
      pageSize: +req.query.pageSize || Settings.pagination.pageSize,
      page: +req.query.page || 1,
      withRelated: ['organizationalunit', 'promoItems']
    };

    Promotion
      .forge()
      .orderBy('startDate')
      .orderBy('endDate')
      .orderBy('name')
      .fetchPage(pageOpts)
      .then(collection => {
        res.json({ items: collection.toJSON(), pagination: collection.pagination });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Promotion:GET', e)));
      });
  });

  app.put('/promotion', (req, res) => {

    const promo = req.body;
    const items = promo.promoItems;
    delete promo.promoItems;

    bookshelf.transaction(t => {
      Promotion
        .forge()
        .save(promo, { transacting: t })
        .then(item => {
          return Promise
            .all(_.map(items, (i: any) => {
              i.promoId = item.id;
              return PromoItem.forge().save(i, { transacting: t });
            }))
            .then(t.commit, t.rollback)
            .then(() => {
              res.json({ flash: `Created new promotion "${item.name}"`, data: item });
            });
        })
        .catch(e => {
          res.status(500).json({ formErrors: e.data || [] });
        });
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
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem/:id:GET', e)));
      });
  });

  app.patch('/promotion/:id', (req, res) => {

    const promo = req.body;
    const items = promo.promoItems;
    delete promo.promoItems;

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
                  res.json({ flash: `Updated promotion "${promo.name}"`, data: item });
                });
            })
            .catch(e => {
              console.log(e);
              res.status(500).json({ formErrors: e.data || [] });
            });
        })
        .catch(e => {
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
                res.json({ flash: `Removed promotion successfully.` });
            });
        })
        .catch(e => {
          const errorMessage = Logger.parseDatabaseError(e, 'Item');
          res.status(500).json({ flash: errorMessage });
        });
    });
  });
};
