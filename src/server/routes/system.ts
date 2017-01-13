
import * as _ from 'lodash';
import { readSettings, writeSettings } from '../_settings';
import { recordAuditMessage, MESSAGE_CATEGORIES } from './_logging';

let nodePrinter = null;
try {
  nodePrinter = require('node_printer.node');
} catch(e) {
  console.error('Could not load node-printer.');
}

export default (app) => {
  app.get('/system', (req, res) => {
    readSettings(data => res.json(data));
  });

  app.get('/system/printers', (req, res) => {
    if(!nodePrinter) {
      return res.json([]);
    }
    res.json(nodePrinter.getPrinters());
  });

  app.patch('/system', (req, res) => {
    if(req.body.application) {
      req.body.application.taxRate = +req.body.application.taxRate;
      req.body.application.businessName = _.truncate(req.body.application.businessName, { length: 50, omission: '' });
      req.body.application.locationName = +req.body.application.locationName;
      req.body.application.customBusinessCurrency = _.truncate(req.body.application.customBusinessCurrency, { length: 25, omission: '' });
    }

    if(req.body.printer) {
      req.body.printer.characterWidth = +req.body.printer.characterWidth;
    }

    writeSettings(req.body, () => {
      recordAuditMessage(req, MESSAGE_CATEGORIES.SYSTEM, `System settings were updated.`, { settings: req.body });
      res.json({ flash: 'Settings updated successfully.', data: req.body });
    });
  });
};
