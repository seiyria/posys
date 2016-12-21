
import * as _ from 'lodash';

import { StockItem } from '../orm/stockitem';
import { Logger } from '../logger';

const getColumnsAndRelated = (columns) => {
  const withRelated = [];

  if(_.includes(columns, 'organizationalunit.name')) {
    columns.push('organizationalunitId');
    withRelated.push('organizationalunit');
    _.pull(columns, 'organizationalunit.name');
  }

  return { columns, withRelated };
};

export default (app) => {
  app.post('/inventory/export', (req, res) => {

    const { columns, withRelated } = getColumnsAndRelated(req.body.columns);

    StockItem
      .collection()
      .fetch({ columns, withRelated })
      .then(collection => {
        res.json(collection.toJSON());
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Inventory/export:POST', e)));
      });
  });

  app.post('/inventory/import', (req, res) => {

  });
};
