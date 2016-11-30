
import { StockItem } from '../orm/stockitem';
import { Logger } from '../logger';
import Settings from './_settings';

export default (app) => {
  app.get('/stockitem', (req, res) => {
    StockItem
      .collection()
      .orderBy('name', 'ASC')
      .fetchPage({
        pageSize: Settings.pagination.pageSize
      })
      .then(collection => {
        res.json(collection.toJSON());
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem:GET', e)));
      });
  });

  app.put('/stockitem', (req, res) => {
    new StockItem(req.body)
      .save()
      .then(item => {
        console.log(item);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem:PUT', e)));
      });
  });

  app.get('/stockitem/:id', (req, res) => {
    StockItem
      .where('id', req.params.id)
      .then(collection => {
        res.json(collection.toJSON());
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem:GET/:id', e)));
      });
  });

  app.patch('/stockitem/:id', (req, res) => {
    new StockItem({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(item => {
        console.log(item);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem:PATCH/:id', e)));
      });
  });

  app.delete('/stockitem/:id', (req, res) => {
    new StockItem({ id: req.params.id })
      .destroy()
      .then(item => {
        console.log(item);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem:DELETE/:id', e)));
      });
  });
};
