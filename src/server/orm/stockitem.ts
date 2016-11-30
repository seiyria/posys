
import { bookshelf } from '../server';

export const StockItem = bookshelf.Model.extend({
  tableName: 'stockitem',
  softDelete: true
});
