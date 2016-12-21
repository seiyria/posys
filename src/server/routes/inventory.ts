
import * as _ from 'lodash';

import { bookshelf } from '../server';

import { StockItem } from '../orm/stockitem';
import { OrganizationalUnit } from '../orm/organizationalunit';
import { OrganizationalUnit as OrganizationalUnitModel } from '../../client/models/organizationalunit';
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
    const items = req.body;

    OrganizationalUnit
      .collection()
      .fetch()
      .then(collection => {
        const ous = collection.toJSON();

        const ouHash = _.reduce(ous, (prev, cur: OrganizationalUnitModel) => {
          prev[cur.name] = cur.id;
          return prev;
        }, {});

        _.each(items, item => {
          if(item.organizationalunit) {
            item.organizationalunitId = ouHash[item.organizationalunit.name];
          }

          if(!item.organizationalunitId) {
            item.organizationalunitId = 1;
          }

          delete item.organizationalunit;

          bookshelf.transaction(t => {

            const errorHandler = (e) => {
              if(res.headersSent) { return; }
              res.status(500).json({ flash: Logger.parseDatabaseError(e, 'Import') });
            };

            const insertPromises = _.map(items, item => {
              return StockItem
                .forge()
                .save(item, { transacting: t })
                .catch(errorHandler);
            });

            Promise
              .all(insertPromises)
              .then(t.commit, t.rollback)
              .then(() => {
                res.json({ flash: `Import successful.`, data: item });
              })
              .catch(errorHandler);
          });
        });
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Inventory/import:POST', e)));
      });
  });
};
