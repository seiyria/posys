
import { Location } from '../orm/location';
import { Logger } from '../logger';

import { Location as LocationModel } from '../../client/models/location';

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
        res.json(item);
      })
      .catch(e => {
        const errorMessage = Logger.parseDatabaseError(e, 'Location');
        res.status(500).json({ flash: errorMessage });
      });
  });
};
