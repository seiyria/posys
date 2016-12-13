/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { Invoice } from './invoice';

export const InvoicePromo = bookshelf.Model.extend({
  tableName: 'invoicepromo',
  hasTimestamps: true,
  softDelete: false,
  promotion: function() {
    return this.belongsTo(Invoice);
  },
  validations: {
  }
});
