/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { OrganizationalUnit } from './organizationalunit';
import { StockItemVendor } from './stockitemvendor';

export const StockItem = bookshelf.Model.extend({
  tableName: 'stockitem',
  hasTimestamps: true,
  softDelete: false,
  vendors: function() {
    return this.hasMany(StockItemVendor, 'stockitemId');
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
        error: 'Your category name must be between 1 and 50 characters.'
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
        method: 'isNum',
        error: 'You must specify a valid OU.'
      }
    ],
    cost: [
      {
        method: 'isRequired',
        error: 'Cost is required.'
      },
      {
        method: 'isNum',
        args: { min: 0 },
        error: 'You must specify a positive cost.'
      }
    ],
    vendorPurchasePrice: [
      {
        method: 'isNum',
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
        method: 'isNum',
        args: { min: 0 },
        error: 'You must specify a quantity >= 0.'
      }
    ],
    reorderThreshold: [
      {
        method: 'isNum',
        args: { min: 0 },
        error: 'You must specify a threshold >= 0.'
      }
    ],
    reorderUpToAmount: [
      {
        method: 'isNum',
        args: { min: 0 },
        error: 'You must specify an amount >= 0.'
      }
    ]
  }
});
