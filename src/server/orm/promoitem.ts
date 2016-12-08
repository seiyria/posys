/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { Promotion } from './promotion';

export const PromoItem = bookshelf.Model.extend({
  tableName: 'promoitem',
  hasTimestamps: true,
  softDelete: false,
  promotion: function() {
    return this.belongsTo(Promotion);
  },
  validations: {
    name: [
      {
        method: 'isLength',
        args: { min: 1, max: 50 },
        error: 'Your OU name must be between 1 and 50 characters.'
      }
    ],
    sku: [
      {
        method: 'isRequired',
        error: 'SKU is required.'
      },
      {
        method: 'isLength',
        args: { min: 1, max: 50 },
        error: 'Your SKU must be between 1 and 50 characters.'
      }
    ],
    description: [
      {
        method: 'isLength',
        args: { min: 1, max: 500 },
        error: 'Your description must be between 1 and 500 characters.'
      }
    ],
    stockitemId: [
      {
        method: 'isInt',
        error: 'You must specify a valid item.'
      }
    ]
  }
});
