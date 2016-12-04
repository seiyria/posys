/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { OrganizationalUnit } from './organizationalunit';

export const StockItem = bookshelf.Model.extend({
  tableName: 'stockitem',
  hasTimestamps: true,
  softDelete: false,
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
    stockCode: [
      {
        method: 'isLength',
        args: { min: 1, max: 50 },
        error: 'Your Stock ID must be between 1 and 50 characters.'
      }
    ],
    description: [
      {
        method: 'isLength',
        args: { min: 1, max: 500 },
        error: 'Your description must be between 1 and 500 characters.'
      }
    ],
    organizationalunitId: [
      {
        method: 'isRequired',
        error: 'OU is required.'
      },
      {
        method: 'isInt',
        error: 'You must specify a valid OU.'
      }
    ],
    cost: [
      {
        method: 'isRequired',
        error: 'Cost is required.'
      },
      {
        method: 'isFloat',
        args: { min: 0 },
        error: 'You must specify a positive cost.'
      }
    ],
    vendorPurchasePrice: [
      {
        method: 'isFloat',
        args: { min: 0 },
        error: 'You must specify a positive vendor purchase price.'
      }
    ],
    quantity: [
      {
        method: 'isRequired',
        error: 'Quantity is required.'
      },
      {
        method: 'isInt',
        args: { min: 0 },
        error: 'You must specify a quantity greater than or equal to 0.'
      }
    ],
    reorderThreshold: [
      {
        method: 'isInt',
        args: { min: 0 },
        error: 'You must specify a threshold greater than or equal to 0.'
      }
    ],
    reorderUpToAmount: [
      {
        method: 'isInt',
        args: { min: 0 },
        error: 'You must specify an amount greater than or equal to 0.'
      }
    ]
  }
});
