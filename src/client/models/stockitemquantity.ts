
import * as _ from 'lodash';

export class StockItemVendor {
  id?: number;
  stockitemId?: number;
  locationId?: number;

  quantity: number;

  constructor(initializer?: StockItemVendor) {
    _.assign(this, initializer);
  }
}
