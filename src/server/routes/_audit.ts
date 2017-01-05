
import { AuditMessage } from '../orm/auditmessage';

export const AUDIT_CATEGORIES = {
  INVOICE: 'Invoice',
  INVENTORY: 'Inventory',
  LOCATION: 'Location',
  OU: 'Category',
  PROMOTION: 'Promotion',
  REPORT: 'Report',
  STOCKITEM: 'StockItem',
  SYSTEM: 'System'
};

export const recordAuditMessage = (req, module, message, refObject?) => {
  const insertRecord: any = { module, message, refObject };
  insertRecord.locationId = +req.header('X-Location');
  insertRecord.terminalId = req.header('X-Terminal');

  AuditMessage
    .forge(insertRecord)
    .save();
};
