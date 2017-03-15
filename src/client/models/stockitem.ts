
import * as _ from 'lodash';

import { OrganizationalUnit } from './organizationalunit';
import { StockItemVendor } from './stockitemvendor';

export class StockItem {
  id?: number;
  sku: string;
  name: string;
  photoUrl?: string;
  description?: string;
  organizationalunitId?: number;
  organizationalunit?: OrganizationalUnit;
  taxable: boolean;
  cost: number;
  quantity: number;
  reorderThreshold?: number;
  reorderUpToAmount?: number;
  lastSoldAt?: Date;

  vendors?: StockItemVendor[];

  temporary?: boolean;
  promoApplyId?: string;

  constructor(initializer?: StockItem) {
    _.assign(this, initializer);

    if(this.name) {
      this.name = this.name.trim();
    }

    if(this.description) {
      this.description = this.description.trim();
    }

    if(!this.vendors) {
      this.vendors = [];
    }
  }
}
