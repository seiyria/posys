/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { Invoice } from './invoice';

export const InvoiceItem = bookshelf.Model.extend({
  tableName: 'invoiceitem',
  hasTimestamps: true,
  softDelete: false,
  promotion: function() {
    return this.belongsTo(Invoice);
  },
  validations: {
  }
});
