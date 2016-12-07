
import * as _ from 'lodash';

import { StockItem } from './stockitem';

export class PromoItem {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  stockitemId?: number;
  stockItem?: StockItem;
  temporary?: boolean;

  constructor(initializer?: PromoItem|StockItem) {
    _.assign(this, initializer);
  }
}
