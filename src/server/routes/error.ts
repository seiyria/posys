/* tslint:disable:only-arrow-functions no-invalid-this */

import { ErrorMessage } from '../orm/errormessage';

import { Logger } from '../logger';
import Settings from './_settings';

import { recordErrorMessageFromClient, recordErrorMessageFromServer, MESSAGE_CATEGORIES } from './_logging';

export default (app) => {
  app.get('/errormessage', (req, res) => {

    const pageOpts = {
      pageSize: +req.query.pageSize || Settings.pagination.pageSize,
      page: +req.query.page || 1,
      withRelated: ['location']
    };

    ErrorMessage
      .forge()
      .query(qb => {
        if(req.query.module) {
          qb.andWhere('module', '=', req.query.module);
        }

        if(req.query.location) {
          qb.andWhere('locationId', '=', +req.query.location);
        }
      })
      .orderBy('-id')
      .fetchPage(pageOpts)
      .then(collection => {
        res.json({ items: collection.toJSON(), pagination: collection.pagination });
      })
      .catch(e => {
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.SYSTEM, e);
        res.status(500).json(Logger.browserError(Logger.error('Route:ErrorMessage:GET', e)));
      });
  });

  app.put('/errormessage', (req) => {
    recordErrorMessageFromClient(req, req.body);
  });
};
