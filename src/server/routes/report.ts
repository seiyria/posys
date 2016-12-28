
import * as _ from 'lodash';

import { bookshelf } from '../server';

import { StockItem } from '../orm/stockitem';
import { ReportConfiguration as ReportConfigurationModel } from '../../client/models/reportconfiguration';
import { Logger } from '../logger';

const getColumnsAndRelated = (columns) => {
  const withRelated = [];

  if(_.includes(columns, 'organizationalunit.name')) {
    columns.push('organizationalunitId');
    withRelated.push('organizationalunit');
    _.pull(columns, 'organizationalunit.name');
  }

  const vendorKeys = ['vendors[0].name', 'vendors[0].stockId', 'vendors[0].cost'];

  if(_.some(vendorKeys, key => _.includes(columns, key))) {
    columns.push('id');
    withRelated.push('vendors');
    _.each(vendorKeys, key => _.pull(columns, key));
  }

  _.each(columns, col => {
    if(!_.includes(col, '.length')) { return; }
    _.pull(columns, col);
  });

  return { columns, withRelated };
};

export default (app) => {
  app.post('/report/base/inventory/current', (req, res) => {

    const config: ReportConfigurationModel = req.body;

    const { columns, withRelated } = getColumnsAndRelated(_.map(config.columns, 'key'));

    StockItem
      .forge()
      .where(qb => {
        if(!config.optionValues.includeOutOfStock) {
          qb.where('quantity', '>', 0);
        }
        if(config.ouFilter) {
          qb.where('organizationalunitId', '=', config.ouFilter);
        }
      })
      .fetchAll({ columns, withRelated })
      .then(collection => {
        const items = collection.toJSON();
        _.each(items, item => {
          if(!item.vendors || !item.vendors.length) { return; }
          item.vendors = [_.find(item.vendors, { isPreferred: true })];
        });
        res.json(items);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Report/base/inventory/current:POST', e)));
      });
  });

  app.post('/report/base/inventory/old', (req, res) => {

    const config: ReportConfigurationModel = req.body;

    const { columns, withRelated } = getColumnsAndRelated(_.map(config.columns, 'key'));

    if(!config.startDate) {
      return res.status(500).json({ flash: 'You must specify a date to filter by.' });
    }

    StockItem
      .forge()
      .where(qb => {
        if(config.ouFilter) {
          qb.where('organizationalunitId', '=', config.ouFilter);
        }

        if(config.optionValues.includeUnsold) {
          qb
            .orWhere('lastSoldAt', '<', config.startDate)
            .orWhere('lastSoldAt', 'is', null);
        } else {
          qb.where('lastSoldAt', '<', config.startDate);
        }
      })
      .fetchAll({ columns, withRelated })
      .then(collection => {
        const items = collection.toJSON();
        _.each(items, item => {
          if(!item.vendors || !item.vendors.length) { return; }
          item.vendors = [_.find(item.vendors, { isPreferred: true })];
        });
        res.json(items);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Report/base/inventory/old:POST', e)));
      });
  });
};
