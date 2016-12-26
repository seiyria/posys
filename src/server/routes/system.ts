
import * as _ from 'lodash';

const fs = require('fs');
const appRoot = require('app-root-path');

const readSettings = (callback) => {
  fs.readFile(`${appRoot}/server.config.json`, 'utf8', (err, data) => {
    if(err) { throw err; }
    callback(JSON.parse(data));
  });
};

export default (app) => {
  app.get('/system', (req, res) => {
    readSettings(data => res.json(data));
  });

  app.patch('/system', (req, res) => {
    req.body.application.taxRate = +req.body.application.taxRate;
    req.body.application.businessName = _.truncate(req.body.application.businessName, { length: 50, omission: '' });
    req.body.application.locationName = _.truncate(req.body.application.locationName, { length: 50, omission: '' });
    req.body.application.terminalId = _.truncate(req.body.application.terminalId, { length: 50, omission: '' });

    fs.writeFile(`${appRoot}/server.config.json`, JSON.stringify(req.body, null, 4), (err) => {
      if(err) { throw err; }
      res.json({ flash: 'Settings updated successfully.', data: req.body });
    });
  });
};
