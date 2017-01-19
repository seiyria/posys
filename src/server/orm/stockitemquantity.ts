/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

export const StockItemQuantity = bookshelf.Model.extend({
  tableName: 'stockitemquantity',
  hasTimestamps: false,
  softDelete: false,
  validations: {}
});
