
import { AuditMessage } from '../orm/auditmessage';
import { ErrorMessage } from '../orm/errormessage';

export const MESSAGE_CATEGORIES = {
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

export const recordErrorMessageFromClient = (req, errorMessage) => {
  recordErrorMessage(req, 'Unknown', errorMessage.message, errorMessage.stack, 'Client');
};

export const recordErrorMessageFromServer = (req, module, error) => {
  if(error.data) { return; }
  recordErrorMessage(req, module, error.message, error.stack, 'Server');
};

export const recordErrorMessage = (req, module, message, stack, foundAt = 'Server') => {
  const insertRecord: any = { module, message, stack, foundAt };
  insertRecord.locationId = +req.header('X-Location');
  insertRecord.terminalId = req.header('X-Terminal');

  ErrorMessage
    .forge(insertRecord)
    .save();
};
