/* tslint:disable:only-arrow-functions no-invalid-this */

import { AuditMessage } from '../orm/auditmessage';

import { Logger } from '../logger';
import Settings from './_settings';

export default (app) => {
  app.get('/auditmessage', (req, res) => {

    const pageOpts = {
      pageSize: +req.query.pageSize || Settings.pagination.pageSize,
      page: +req.query.page || 1,
      withRelated: ['location']
    };

    AuditMessage
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
        res.status(500).json(Logger.browserError(Logger.error('Route:AuditMessage:GET', e)));
      });
  });
};
