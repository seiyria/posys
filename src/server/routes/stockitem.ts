
import * as _ from 'lodash';

import { knex } from '../server';

import { StockItem } from '../orm/stockitem';

import { Logger } from '../logger';
import Settings from './_settings';

const cleanItem = (item) => {
  item.quantity = '' + item.quantity;
  item.organizationalunitId = '' + item.organizationalunitId;
  if(item.reorderThreshold) {
    item.reorderThreshold = '' + item.reorderThreshold;
  }
  if(item.reorderUpToAmount) {
    item.reorderUpToAmount = '' + item.reorderUpToAmount;
  }
  delete item.organizationalunit;
};

export default (app) => {
  app.get('/stockitem', (req, res) => {

    const pageOpts = {
      pageSize: +req.query.pageSize || Settings.pagination.pageSize,
      page: +req.query.page || 1,
      withRelated: ['organizationalunit']
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
        withRelated: ['organizationalunit']
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
        res.json({ flash: `Updated quantities for ${_.keys(req.body).length} stock items (${numItems} total imported)` });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem/import:POST', e)));
      });
  });

  app.put('/stockitem', (req, res) => {
    cleanItem(req.body);

    StockItem
      .forge(req.body)
      .save()
      .then(item => {
        StockItem
          .forge({ id: item.id })
          .fetch({
            withRelated: ['organizationalunit']
          })
          .then(newItem => {
            newItem = newItem.toJSON();
            res.json({ flash: `Created new item "${newItem.name}"`, data: newItem });
          })
          .catch(e => {
            res.status(500).json({ formErrors: e.data || [] });
          })
      })
      .catch(e => {
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.get('/stockitem/:id', (req, res) => {
    StockItem
      .forge({ id: req.params.id })
      .fetch({
        withRelated: ['organizationalunit']
      })
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem/:id:GET', e)));
      });
  });

  app.patch('/stockitem/:id', (req, res) => {
    cleanItem(req.body);

    StockItem
      .forge({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(item => {
        item = item.toJSON();
        res.json({ flash: `Updated item "${item.name}"`, data: item });
      })
      .catch(e => {
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.delete('/stockitem/:id', (req, res) => {
    StockItem
      .forge({ id: req.params.id })
      .destroy()
      .then(item => {
        item = item.toJSON();
        res.json({ flash: `Removed item "${item.name}"`, data: item });
      })
      .catch(e => {
        const errorMessage = Logger.parseDatabaseError(e, 'Item');
        res.status(500).json({ flash: errorMessage });
      });
  });
};
