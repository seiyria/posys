
import { StockItem } from '../orm/stockitem';

import { Logger } from '../logger';
import Settings from './_settings';

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
      .fetchPage(pageOpts)
      .then(collection => {
        res.json({ items: collection.toJSON(), pagination: collection.pagination });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem:GET', e)));
      });
  });

  app.post('/stockitem/search', (req, res) => {
    StockItem
      .collection()
      .orderBy('name', 'ASC')
      .query(qb => {
        qb
          .where('sku', 'LIKE', req.body.query)
          .orWhere('description', 'LIKE', req.query.body)
          .orWhere('name', 'LIKE', req.query.body);
      })
      .fetchPage({
        pageSize: Settings.search.pageSize
      })
      .then(collection => {
        res.json(collection.toJSON());
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem/Search:POST', e)));
      });
  });

  app.put('/stockitem', (req, res) => {
    StockItem
      .forge(req.body)
      .save()
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.get('/stockitem/:id', (req, res) => {
    StockItem
      .forge({ id: req.params.id })
      .fetch()
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem:GET/:id', e)));
      });
  });

  app.patch('/stockitem/:id', (req, res) => {
    req.body.quantity = '' + req.body.quantity;
    req.body.organizationalunitId = '' + req.body.organizationalunitId;
    delete req.body.organizationalunit;

    StockItem
      .forge({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(item => {
        res.json(item);
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
        res.json(item);
      })
      .catch(e => {
        const errorMessage = Logger.parseDatabaseError(e, 'Item');
        res.status(500).json({ flash: errorMessage });
      });
  });
};
