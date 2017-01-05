
import * as _ from 'lodash';

import { knex, bookshelf } from '../server';

import { StockItem } from '../orm/stockitem';
import { StockItemVendor } from '../orm/stockitemvendor';
import { StockItem as StockItemModel } from '../../client/models/stockitem';

import { Logger } from '../logger';
import Settings from './_settings';
import { recordAuditMessage, AUDIT_CATEGORIES } from './_audit';

const cleanItem = (item) => {
  item.cost = +item.cost;
  if(!item.reorderThreshold) { item.reorderThreshold = undefined; }
  if(!item.reorderUpToAmount) { item.reorderUpToAmount = undefined; }
  delete item.organizationalunit;
  return item;
};

export default (app) => {
  app.get('/stockitem', (req, res) => {

    const pageOpts = {
      pageSize: +req.query.pageSize || Settings.pagination.pageSize,
      page: +req.query.page || 1,
      withRelated: ['organizationalunit', 'vendors']
    };

    StockItem
      .forge()
      .orderBy('name')
      .orderBy('sku')
      .where('quantity', '>', +req.query.hideOutOfStock ? '0' : '-1')
      .fetchPage(pageOpts)
      .then(collection => {
        res.json({ items: collection.toJSON(), pagination: collection.pagination });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem:GET', e)));
      });
  });

  app.get('/stockitem/search', (req, res) => {
    const query = `%${req.query.query}%`;
    StockItem
      .forge()
      .orderBy('name')
      .orderBy('sku')
      .query(qb => {
        qb
          .where('sku', 'ILIKE', query)
          .orWhere('description', 'ILIKE', query)
          .orWhere('name', 'ILIKE', query);
      })
      .fetchPage({
        pageSize: Settings.search.pageSize,
        page: 1,
        withRelated: ['organizationalunit', 'vendors']
      })
      .then(collection => {
        res.json(collection.toJSON());
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem/Search:POST', e)));
      });
  });

  app.post('/stockitem/import', (req, res) => {
    let numItems = 0;

    Promise.all(_.map(req.body, (v: number, k: string) => {
      numItems += v;

      return knex('stockitem')
        .where('sku', '=', k)
        .increment('quantity', v);
    }))
      .then(() => {
        recordAuditMessage(req, AUDIT_CATEGORIES.STOCKITEM, `A stockitem import has completed (${_.keys(req.body).length} items, ${numItems} total).`, { items: req.body });
        res.json({ flash: `Updated quantities for ${_.keys(req.body).length} stock items (${numItems} total imported)` });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem/import:POST', e)));
      });
  });

  app.post('/stockitem/export', (req, res) => {
    let numItems = 0;

    Promise.all(_.map(req.body, (v: number, k: string) => {
      numItems += v;

      return knex('stockitem')
        .where('sku', '=', k)
        .decrement('quantity', v);
    }))
      .then(() => {
        recordAuditMessage(req, AUDIT_CATEGORIES.STOCKITEM, `A stockitem export has completed (${_.keys(req.body).length} items, ${numItems} total).`, { items: req.body });
        res.json({ flash: `Updated quantities for ${_.keys(req.body).length} stock items (${numItems} total exported)` });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem/export:POST', e)));
      });
  });

  app.put('/stockitem', (req, res) => {
    const stockitem = cleanItem(new StockItemModel(req.body));
    const vendors = stockitem.vendors;
    delete stockitem.vendors;

    bookshelf.transaction(t => {
      StockItem
        .forge()
        .save(stockitem, { transacting: t })
        .then(newItem => {
          return Promise
            .all(_.map(vendors, (i: any) => {
              i.stockitemId = newItem.id;
              return StockItemVendor.forge().save(i, { transacting: t });
            }))
            .then(t.commit, t.rollback)
            .then(() => {
              recordAuditMessage(req, AUDIT_CATEGORIES.STOCKITEM, `A new stockitem was created (${newItem.name}).`, { id: newItem.id });
              res.json({ flash: `Created new item successfully`, data: newItem });
            })
            .catch(e => {
              res.status(500).json({ formErrors: e.data || [] });
            });
        })
        .catch(e => {
          res.status(500).json({ formErrors: e.data || [] });
        });
    });
  });

  app.get('/stockitem/:id', (req, res) => {
    StockItem
      .forge({ id: req.params.id })
      .fetch({
        withRelated: ['organizationalunit', 'vendors']
      })
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem/:id:GET', e)));
      });
  });

  app.patch('/stockitem/:id', (req, res) => {
    const stockitem = cleanItem(new StockItemModel(req.body));
    const vendors = stockitem.vendors;
    delete stockitem.vendors;

    bookshelf.transaction(t => {
      StockItemVendor
        .query(qb => {
          qb
            .where({ stockitemId: req.params.id });
        })
        .destroy({ transacting: t })
        .then(() => {
          return StockItem
            .forge()
            .save(stockitem, { transacting: t, patch: true })
            .then(item => {
              const realItem = item.toJSON();

              return Promise
                .all(_.map(vendors, (i: any) => {
                  i.stockitemId = item.id;
                  delete i.id;
                  return StockItemVendor.forge().save(i, { transacting: t });
                }))
                .then(t.commit, t.rollback)
                .then(() => {
                  recordAuditMessage(req, AUDIT_CATEGORIES.STOCKITEM, `A stockitem was updated (${realItem.name}).`, { id: realItem.id });
                  res.json({ flash: `Updated item "${realItem.name}"`, data: realItem });
                });
            })
            .catch(e => {
              res.status(500).json({ formErrors: e.data || [] });
            });
        })
        .catch(e => {
          const errorMessage = Logger.parseDatabaseError(e, 'Item');
          res.status(500).json({ flash: errorMessage });
        });
    });
  });

  app.delete('/stockitem/:id', (req, res) => {
    StockItem
      .forge({ id: req.params.id })
      .destroy()
      .then(item => {
        item = item.toJSON();
        recordAuditMessage(req, AUDIT_CATEGORIES.STOCKITEM, `A stockitem was removed.`, { id: +req.params.id, oldId: +req.params.id });
        res.json({ flash: `Removed item successfully.`, data: item });
      })
      .catch(e => {
        const errorMessage = Logger.parseDatabaseError(e, 'Item');
        res.status(500).json({ flash: errorMessage });
      });
  });
};
