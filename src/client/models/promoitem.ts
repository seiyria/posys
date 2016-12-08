
import * as _ from 'lodash';

import { StockItem } from './stockitem';

export class PromoItem {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  stockitemId?: number;
  stockitem?: StockItem;
  temporary?: boolean;

  constructor(initializer?: PromoItem|StockItem|any) {
    if(!initializer) return;
    this.id = initializer.id;
    this.sku = initializer.sku;
    this.name = initializer.name;
    this.description = initializer.description;
    this.stockitemId = initializer.stockitemId;
    this.stockitem = initializer.stockitem;
    this.temporary = initializer.temporary;
  }
}
