/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { Invoice } from './invoice';
import { Promotion } from './promotion';

export const InvoicePromo = bookshelf.Model.extend({
  tableName: 'invoicepromo',
  hasTimestamps: true,
  softDelete: false,
  promotion: function() {
    return this.belongsTo(Invoice);
  },
  _promoData: function() {
    return this.belongsTo(Promotion, 'promoId');
  },
  validations: {
  }
});
