/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

export const Invoice = bookshelf.Model.extend({
  tableName: 'invoice',
  hasTimestamps: true,
  softDelete: false,
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
        args: { arr: ['Cash', 'Credit', 'Debit', 'Check'] },
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
