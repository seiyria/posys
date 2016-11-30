
import { OrganizationalUnit } from '../orm/organizationalunit';

export default (app) => {
  app.get('/organizationalunit', (req, res) => {
    OrganizationalUnit
      .collection()
      .fetch()
      .then(collection => {
        res.json(collection);
      });
  });
};
