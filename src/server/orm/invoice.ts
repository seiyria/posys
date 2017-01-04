/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

import { InvoiceItem } from './invoiceitem';
import { InvoicePromo } from './invoicepromo';

export const Invoice = bookshelf.Model.extend({
  tableName: 'invoice',
  hasTimestamps: true,
  softDelete: true,
  stockitems: function() {
    return this.hasMany(InvoiceItem, 'invoiceId');
  },
  promotions: function() {
    return this.hasMany(InvoicePromo, 'invoiceId');
  },
  validations: {
    purchaseTime: [
      {
        method: 'isRequired',
        error: 'Invoice purchase time required.'
      }
    ],
    purchaseMethod: [
      {
        method: 'isRequired',
        error: 'Invoice purchase method required.'
      },
      {
        method: 'isIn',
        args: { arr: ['Cash', 'Credit', 'Debit', 'Check', 'Custom', 'Return', 'Hold', 'Void'] },
        error: 'Invalid invoice purchase method specified.'
      }
    ],
    purchasePrice: [
      {
        method: 'isRequired',
        error: 'Invoice purchase price required.'
      }
    ]
  }
});
