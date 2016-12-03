
import { OrganizationalUnit } from '../orm/organizationalunit';
import { Logger } from '../logger';

export default (app) => {
  app.get('/organizationalunit', (req, res) => {
    OrganizationalUnit
      .collection()
      .orderBy('name', 'ASC')
      .fetch()
      .then(collection => {
        res.json(collection.toJSON());
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:OrganizationalUnit:GET', e)));
      });
  });

  app.put('/organizationalunit', (req, res) => {
    OrganizationalUnit
      .forge(req.body)
      .save()
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.patch('/organizationalunit/:id', (req, res) => {
    OrganizationalUnit
      .forge({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.delete('/organizationalunit/:id', (req, res) => {
    OrganizationalUnit
      .forge({ id: req.params.id })
      .destroy()
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        const errorMessage = Logger.parseDatabaseError(e, 'OU');
        res.status(500).json({ flash: errorMessage });
      });
  });
};
