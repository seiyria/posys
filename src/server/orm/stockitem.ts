
import { bookshelf } from '../server';

export const StockItem = bookshelf.Model.extend({
  tableName: 'stockitem',
  hasTimestamps: true,
  softDelete: true
});
