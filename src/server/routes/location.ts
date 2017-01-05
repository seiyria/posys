
import { Location } from '../orm/location';
import { Logger } from '../logger';

import { Location as LocationModel } from '../../client/models/location';
import { recordAuditMessage, AUDIT_CATEGORIES } from './_audit';

export default (app) => {
  app.get('/location', (req, res) => {
    Location
      .collection()
      .orderBy('name', 'ASC')
      .fetch()
      .then(collection => {
        res.json(collection.toJSON());
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:Location:GET', e)));
      });
  });

  app.put('/location', (req, res) => {
    const loca = new LocationModel(req.body);

    Location
      .forge(loca)
      .save()
      .then(item => {
        recordAuditMessage(req, AUDIT_CATEGORIES.LOCATION, `A new location was added (${loca.name}).`, { id: item.id });
        res.json(item);
      })
      .catch(e => {
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.patch('/location/:id', (req, res) => {
    const loca = new LocationModel(req.body);

    Location
      .forge({ id: req.params.id })
      .save(loca, { patch: true })
      .then(item => {
        recordAuditMessage(req, AUDIT_CATEGORIES.LOCATION, `A location was changed (${loca.name}).`, { id: item.id });
        res.json(item);
      })
      .catch(e => {
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.delete('/location/:id', (req, res) => {
    if(+req.params.id === 1) {
      res.status(500).json({ flash: 'Cannot remove the first Location. '});
      return;
    }

    Location
      .forge({ id: req.params.id })
      .destroy()
      .then(item => {
        recordAuditMessage(req, AUDIT_CATEGORIES.LOCATION, `A location was removed.`, { id: +req.params.id, oldId: +req.params.id });
        res.json(item);
      })
      .catch(e => {
        const errorMessage = Logger.parseDatabaseError(e, 'Location');
        res.status(500).json({ flash: errorMessage });
      });
  });
};
