
import * as _ from 'lodash';

export class StockItem {
  id: number;
  sku: string;
  stockCode?: string;
  name: string;
  photoUrl?: string;
  description?: string;
  organizationalunitId?: number;
  taxable: boolean;
  cost: number;
  vendorPurchasePrice?: number;
  quantity: number;
  reorderThreshold?: number;
  reorderUpToAmount?: number;

  constructor(initializer?: StockItem) {
    _.assign(this, initializer);
  }
}
