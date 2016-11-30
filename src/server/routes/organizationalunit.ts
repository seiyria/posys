
import { OrganizationalUnit } from '../orm/organizationalunit';
import { Logger } from '../logger';

export default (app) => {
  app.get('/organizationalunit', (req, res) => {
    OrganizationalUnit
      .collection()
      .fetch()
      .then(collection => {
        res.json(collection.toJSON());
      })
      .catch(e => {
        res.status(500).json(Logger.browserError(Logger.error('Route:OrganizationalUnit:GET', e)));
      });
  });
};
