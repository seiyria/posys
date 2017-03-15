/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { Invoice } from './invoice';
import { StockItem } from './stockitem';

export const InvoiceItem = bookshelf.Model.extend({
  tableName: 'invoiceitem',
  hasTimestamps: true,
  softDelete: false,
  promotion: function() {
    return this.belongsTo(Invoice);
  },
  _stockitemData: function() {
    return this.belongsTo(StockItem, 'stockitemId');
  },
  validations: {
  }
});
