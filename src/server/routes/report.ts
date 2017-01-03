/* tslint:disable:only-arrow-functions no-invalid-this */

import * as _ from 'lodash';

import { StockItem } from '../orm/stockitem';
import { Invoice } from '../orm/invoice';
import { ReportConfiguration } from '../orm/reportconfiguration';

import { ReportConfiguration as ReportConfigurationModel } from '../../client/models/reportconfiguration';
import { Logger } from '../logger';

const getColumnsAndRelated = (columns) => {
  const withRelated = [];

  if(_.includes(columns, 'organizationalunit.name')) {
    columns.push('organizationalunitId');
    withRelated.push('organizationalunit');
    columns = _.reject(columns, testCol => testCol === 'organizationalunit.name');
  }

  const vendorKeys = ['vendors[0].name', 'vendors[0].stockId', 'vendors[0].cost'];

  if(_.some(vendorKeys, key => _.includes(columns, key))) {
    columns.push('id');
    withRelated.push('vendors');
    _.each(vendorKeys, key => columns = _.reject(columns, testCol => testCol === key));
  }

  _.each(columns, col => {
    if(!_.includes(col, '.length')) { return; }
    columns = _.reject(columns, testCol => testCol === col);
  });

  return { columns: _.uniq(columns), withRelated };
};

const fixReport = (config) => {
  config.columnChecked = JSON.stringify(config.columnChecked);
  config.columnOrder = JSON.stringify(config.columnOrder);
  config.options = JSON.stringify(config.options);
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
        const resObj: any = { data: items };
        if(!items.length) {
          resObj.flash = 'No data matched your query.';
        }
        res.json(resObj);
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
            .orWhereNull('lastSoldAt');
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

        const data = collection.toJSON();
        const resObj: any = { data: items };
        if(!data.length) {
          resObj.flash = 'No data matched your query.';
        }
        res.json(resObj);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Report/base/inventory/old:POST', e)));
      });
  });

  app.post('/report/base/inventory/reorder', (req, res) => {

    const config: ReportConfigurationModel = req.body;

    const { columns, withRelated } = getColumnsAndRelated(_.map(config.columns, 'key'));

    StockItem
      .forge()
      .where(qb => {
        if(config.ouFilter) {
          qb.where('organizationalunitId', '=', config.ouFilter);
        }

        qb.andWhere('reorderThreshold', '>', 0);
        qb.andWhere('reorderUpToAmount', '>', 0);
        qb.whereRaw('quantity <= "reorderThreshold"');
      })
      .fetchAll({ columns, withRelated })
      .then(collection => {
        const items = collection.toJSON();
        _.each(items, item => {
          if(!item.vendors || !item.vendors.length) { return; }
          item.vendors = [_.find(item.vendors, { isPreferred: true })];
        });

        const data = collection.toJSON();
        const resObj: any = { data: items };
        if(!data.length) {
          resObj.flash = 'No data matched your query.';
        }
        res.json(resObj);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Report/base/inventory/reorder:POST', e)));
      });
  });

  app.post('/report/base/invoice/reorder', (req, res) => {

    const config: ReportConfigurationModel = req.body;

    const { columns, withRelated } = getColumnsAndRelated(_.map(config.columns, 'key'));

    StockItem
      .forge()
      .where(qb => {
        if(config.ouFilter) {
          qb.where('organizationalunitId', '=', config.ouFilter);
        }

        qb.andWhere('reorderThreshold', '>', 0);
        qb.andWhere('reorderUpToAmount', '>', 0);
        qb.whereRaw('quantity <= "reorderThreshold"');
      })
      .fetchAll({ columns, withRelated })
      .then(collection => {
        const items = collection.toJSON();
        _.each(items, item => {
          if(!item.vendors || !item.vendors.length) { return; }
          item.vendors = [_.find(item.vendors, { isPreferred: true })];
        });

        const data = collection.toJSON();
        const resObj: any = { data: items };
        if(!data.length) {
          resObj.flash = 'No data matched your query.';
        }
        res.json(resObj);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Report/base/inventory/reorder:POST', e)));
      });
  });

  app.post('/report/base/sales/completed', (req, res) => {

    const config: ReportConfigurationModel = req.body;

    const { columns, withRelated } = getColumnsAndRelated(_.map(config.columns, 'key'));
    columns.push('id');
    withRelated.push(...['stockitems', 'promotions']);

    Invoice
      .forge()
      .query(qb => {
        qb
          .andWhere('purchaseTime', '>=', config.startDate)
          .andWhere('purchaseTime', '<', config.endDate)
          .andWhere('isVoided', '!=', true)
          .andWhere('isOnHold', '!=', true)
          .andWhere('purchaseMethod', '!=', 'Return');
      })
      .orderBy('-id')
      .fetchAll({ columns, withRelated })
      .then(collection => {
        const data = collection.toJSON();
        const resObj: any = { data };
        if(!data.length) {
          resObj.flash = 'No data matched your query.';
        }
        if(resObj.stockitems) {
          resObj.stockitems = { length: resObj.stockitems.length };
        }
        if(resObj.promotions) {
          resObj.promotions = { length: resObj.promotions.length };
        }
        res.json(resObj);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Sales/Completed:POST', e)));
      });
  });

  app.post('/report/base/sales/voided', (req, res) => {

    const config: ReportConfigurationModel = req.body;

    const { columns, withRelated } = getColumnsAndRelated(_.map(config.columns, 'key'));
    columns.push('id');
    withRelated.push(...['stockitems', 'promotions']);

    Invoice
      .forge()
      .query(qb => {
        qb
          .andWhere('purchaseTime', '>=', config.startDate)
          .andWhere('purchaseTime', '<', config.endDate)
          .andWhere(function() {
            this
              .orWhere('isVoided', '=', true)
              .orWhere('purchaseMethod', '=', 'Void')
              .orWhereNull('isVoided');
          });
      })
      .orderBy('-id')
      .fetchAll({ columns, withRelated })
      .then(collection => {
        const data = collection.toJSON();
        const resObj: any = { data };
        if(!data.length) {
          resObj.flash = 'No data matched your query.';
        }
        if(resObj.stockitems) {
          resObj.stockitems = { length: resObj.stockitems.length };
        }
        if(resObj.promotions) {
          resObj.promotions = { length: resObj.promotions.length };
        }
        res.json(resObj);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Sales/Completed:POST', e)));
      });
  });

  app.get('/report', (req, res) => {
    ReportConfiguration
      .forge()
      .orderBy('name')
      .fetchAll()
      .then(collection => {
        res.json(collection);
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Report:GET', e)));
      });
  });

  app.put('/report', (req, res) => {

    const config = req.body;
    fixReport(config);

    ReportConfiguration
      .forge()
      .save(req.body)
      .then(newReport => {
        res.json({ flash: `Created new report successfully`, data: newReport });
      })
      .catch(e => {
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.patch('/report/:id', (req, res) => {
    console.log('update', req.body, req.params.id);

    const config = req.body;
    fixReport(config);

    ReportConfiguration
      .forge({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(newReport => {
        res.json({ flash: `Updated report successfully`, data: newReport });
      })
      .catch(e => {
        console.error(e);
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.delete('/report/:id', (req, res) => {
    ReportConfiguration
      .forge({ id: req.params.id })
      .destroy()
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        const errorMessage = Logger.parseDatabaseError(e, 'ReportConfiguration');
        res.status(500).json({ flash: errorMessage });
      });
  });
};
