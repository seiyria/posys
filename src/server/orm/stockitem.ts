
import { bookshelf } from '../server';

export const StockItem = bookshelf.Model.extend({
  tableName: 'stockitem',
  hasTimestamps: true,
  softDelete: true,
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
        method: 'isInt',
        error: 'You must specify a valid OU.'
      }
    ],
    cost: [
      {
        method: 'isFloat',
        args: { min: 0 },
        error: 'You must specify a cost greater than $0.'
      }
    ],
    vendorPurchasePrice: [
      {
        method: 'isFloat',
        args: { min: 0 },
        error: 'You must specify a vendor purchase price greater than $0.'
      }
    ],
    quantity: [
      {
        method: 'isInt',
        args: { min: 0 },
        error: 'You must specify a quantity greater than 0.'
      }
    ],
    reorderThreshold: [
      {
        method: 'isInt',
        args: { min: 0 },
        error: 'You must specify a threshold greater than 0.'
      }
    ],
    reorderUpToAmount: [
      {
        method: 'isInt',
        args: { min: 0 },
        error: 'You must specify an amount greater than 0.'
      }
    ]
  }
});
