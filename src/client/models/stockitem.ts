
import * as _ from 'lodash';

import { OrganizationalUnit } from './organizationalunit';

export class StockItem {
  id?: number;
  sku: string;
  stockCode?: string;
  name: string;
  photoUrl?: string;
  description?: string;
  organizationalunitId?: number;
  organizationalunit?: OrganizationalUnit;
  taxable: boolean;
  cost: number;
  vendorPurchasePrice?: number;
  quantity: number;
  reorderThreshold?: number;
  reorderUpToAmount?: number;
  temporary?: boolean;

  constructor(initializer?: StockItem) {
    _.assign(this, initializer);

    if(this.name) {
      this.name = this.name.trim();
    }

    if(this.description) {
      this.description = this.description.trim();
    }
  }
}
