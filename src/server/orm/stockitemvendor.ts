/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

import { StockItem } from './stockitem';

export const StockItemVendor = bookshelf.Model.extend({
  tableName: 'stockitemvendor',
  hasTimestamps: false,
  softDelete: false,
  stockitem: function() {
    return this.belongsTo(StockItem, 'stockitemId');
  },
  validations: {
    name: [
      {
        method: 'isLength',
        args: { min: 1, max: 50 },
        error: 'Your OU name must be between 1 and 50 characters.'
      }
    ]
  }
});
