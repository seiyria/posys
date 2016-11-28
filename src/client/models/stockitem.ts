import _ from 'lodash';

export class StockItem {
  id: number;
  sku: string;
  stockId?: string;
  name: string;
  photoUrl?: string;
  description?: string;
  departmentId?: number;
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
