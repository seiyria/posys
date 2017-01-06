
import { OrganizationalUnit } from '../orm/organizationalunit';
import { Logger } from '../logger';

import { OrganizationalUnit as OrganizationalUnitModel } from '../../client/models/organizationalunit';
import { recordAuditMessage, recordErrorMessageFromServer, MESSAGE_CATEGORIES } from './_logging';

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
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.OU, e);
        res.status(500).json(Logger.browserError(Logger.error('Route:OrganizationalUnit:GET', e)));
      });
  });

  app.put('/organizationalunit', (req, res) => {
    const ou = new OrganizationalUnitModel(req.body);

    OrganizationalUnit
      .forge(ou)
      .save()
      .then(item => {
        recordAuditMessage(req, MESSAGE_CATEGORIES.OU, `A category was added (${ou.name}).`, { id: item.id });
        res.json(item);
      })
      .catch(e => {
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.OU, e);
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.patch('/organizationalunit/:id', (req, res) => {
    const ou = new OrganizationalUnitModel(req.body);

    ou.name = '';

    console.log(ou);

    OrganizationalUnit
      .forge({ id: req.params.id })
      .save(ou, { patch: true })
      .then(item => {
        recordAuditMessage(req, MESSAGE_CATEGORIES.OU, `A category was changed (${ou.name}).`, { id: item.id });
        res.json(item);
      })
      .catch(e => {
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.OU, e);
        res.status(500).json({ formErrors: e.data || [] });
      });
  });

  app.delete('/organizationalunit/:id', (req, res) => {
    if(+req.params.id === 1) {
      res.status(500).json({ flash: 'Cannot remove the first OU. '});
      return;
    }

    OrganizationalUnit
      .forge({ id: req.params.id })
      .destroy()
      .then(item => {
        recordAuditMessage(req, MESSAGE_CATEGORIES.OU, `A category was removed.`, { id: +req.params.id, oldId: +req.params.id });
        res.json(item);
      })
      .catch(e => {
        recordErrorMessageFromServer(req, MESSAGE_CATEGORIES.OU, e);
        const errorMessage = Logger.parseDatabaseError(e, 'OU');
        res.status(500).json({ flash: errorMessage });
      });
  });
};
