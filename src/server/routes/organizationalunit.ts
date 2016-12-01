
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
    new OrganizationalUnit(req.body)
      .save()
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.delete('/organizationalunit/:id', (req, res) => {
    new OrganizationalUnit({ id: req.params.id })
      .destroy()
      .then(item => {
        res.json(item);
      })
      .catch(e => {
        console.error(e);
        res.status(500).json(Logger.browserError(Logger.error('Route:StockItem:DELETE/:id', e)));
      });
  });
};
