
import * as _ from 'lodash';

import { bookshelf } from '../server';

import { Invoice } from '../orm/invoice';
import { InvoiceItem } from '../orm/invoiceitem';
import { InvoicePromo } from '../orm/invoicepromo';

import { StockItem as StockItemModel } from '../../client/models/stockitem';
import { Promotion as PromotionModel } from '../../client/models/promotion';
import { InvoiceItem as InvoiceItemModel } from '../../client/models/invoiceitem';
import { InvoicePromo as InvoicePromoModel } from '../../client/models/invoicepromo';

import { Logger } from '../logger';
import Settings from './_settings';

export default (app) => {

  app.put('/invoice', (req, res) => {

    console.log(req.body);
    const invoice = req.body;
    const items = invoice.stockitems;
    const promos = invoice.promotions;

    delete invoice.stockitems;
    delete invoice.promotions;

    const errorHandler = (e) => {
      res.status(500).json({ formErrors: e.data || [], flash: 'Transaction failed to complete correctly.' });
    };

    bookshelf.transaction(t => {

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
        i.promoId = i.id;
        delete i.id;

        if(i.temporary) {
          i.promoData = new PromotionModel(i);
        }

        return InvoicePromo.forge().save(new InvoicePromoModel(i), { transacting: t }).catch(errorHandler);
      });

      Invoice
        .forge()
        .save(invoice, { transacting: t })
        .then(item => {
          return Promise
            .all(itemPromises(item).concat(promoPromises(item)))
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
      withRelated: ['stockitems', 'promotions']
    };

    Invoice
      .forge()
      .orderBy('-id')
      .fetchPage(pageOpts)
      .then(collection => {
        res.json({ items: collection.toJSON(), pagination: collection.pagination });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Invoice:GET', e)));
      });
  });

  /*

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
   */
};
