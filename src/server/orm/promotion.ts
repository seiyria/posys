/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { PromoItem } from './promoitem';
import { OrganizationalUnit } from './organizationalunit';

export const Promotion = bookshelf.Model.extend({
  tableName: 'promo',
  hasTimestamps: true,
  softDelete: false,
  promoItems: function() {
    return this.hasMany(PromoItem, 'promoId');
  },
  organizationalunit: function() {
    return this.belongsTo(OrganizationalUnit, 'organizationalunitId');
  },
  validations: {
    name: [
      {
        method: 'isRequired',
        error: 'Name is required.'
      },
      {
        method: 'isLength',
        args: { min: 1, max: 50 },
        error: 'Your OU name must be between 1 and 50 characters.'
      }
    ],
    description: [
      {
        method: 'isLength',
        args: { min: 1, max: 500 },
        error: 'Your description must be between 1 and 500 characters.'
      }
    ],
    discountType: [
      {
        method: 'isRequired',
        error: 'Discount type is required.'
      },
      {
        method: 'isIn',
        args: { arr: ['Dollar', 'Percent'] },
        error: 'Your discount type is invalid.'
      }
    ],
    discountGrouping: [
      {
        method: 'isRequired',
        error: 'Discount grouping is required.'
      },
      {
        method: 'isIn',
        args: { arr: ['SKU', 'OU'] },
        error: 'Your discount grouping is invalid.'
      }
    ],
    itemReductionType: [
      {
        method: 'isRequired',
        error: 'Promotion type is required.'
      },
      {
        method: 'isIn',
        args: { arr: ['BuyXGetNext', 'All'] },
        error: 'Your promotion type is invalid.'
      }
    ],
    discountValue: [
      {
        method: 'isNum',
        args: { min: 0 },
        error: 'You must specify a value > 0.'
      }
    ],
    numItemsRequired: [
      {
        method: 'isRequired',
        error: 'Item count is required.'
      },
      {
        method: 'isNum',
        args: { min: 1 },
        error: 'You must specify a value >= 1.'
      }
    ],
    organizationalunitId: [
      {
        method: 'isNum',
        error: 'You must specify a valid OU.'
      }
    ],
    promoItems: [
      {
        method: 'isLength',
        args: { min: 0 },
        error: 'You must give an array of size > 0.'
      }
    ]
  }
});
