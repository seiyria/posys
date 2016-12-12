/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

export const InvoiceItem = bookshelf.Model.extend({
  tableName: 'invoiceitem',
  hasTimestamps: true,
  softDelete: false,
  validations: {
  }
});
