/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

export const InvoicePromo = bookshelf.Model.extend({
  tableName: 'invoicepromo',
  hasTimestamps: true,
  softDelete: false,
  validations: {
  }
});
