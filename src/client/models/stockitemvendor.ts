
import * as _ from 'lodash';

export class StockItemVendor {
  id?: number;
  stockitemId?: number;

  name: string;
  stockId: string;
  cost: number;
  isPreferred: boolean;

  constructor(initializer?: StockItemVendor) {
    _.assign(this, initializer);

    if(this.name) {
      this.name = this.name.trim();
    }
  }
}
