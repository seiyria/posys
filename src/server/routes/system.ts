
import * as _ from 'lodash';
import { readSettings, writeSettings } from './_settings';

const nodePrinter = require('printer');

export default (app) => {
  app.get('/system', (req, res) => {
    readSettings(data => res.json(data));
  });

  app.get('/system/printers', (req, res) => {
    res.json(nodePrinter.getPrinters());
  });

  app.patch('/system', (req, res) => {
    if(req.body.application) {
      req.body.application.taxRate = +req.body.application.taxRate;
      req.body.application.businessName = _.truncate(req.body.application.businessName, { length: 50, omission: '' });
      req.body.application.locationName = +req.body.application.locationName;
      req.body.application.terminalId = _.truncate(req.body.application.terminalId, { length: 50, omission: '' });
      req.body.application.customBusinessCurrency = _.truncate(req.body.application.customBusinessCurrency, { length: 25, omission: '' });
    }

    if(req.body.printer) {
      req.body.printer.characterWidth = +req.body.printer.characterWidth;
    }

    writeSettings(JSON.stringify(req.body, null, 4), () => {
      res.json({ flash: 'Settings updated successfully.', data: req.body });
    });
  });
};
