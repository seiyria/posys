
import * as _ from 'lodash';

import { StockItem } from './stockitem';
import { Promotion } from './promotion';

export type PurchaseMethod =
  'Cash' | 'Check' | 'Debit' | 'Credit';

export class Invoice {
  id?: number;
  purchaseTime: Date;
  purchaseMethod: PurchaseMethod;
  purchasePrice: number;
  cashGiven?: number;
  isVoided?: boolean;

  stockitems?: StockItem[];
  promotions?: Promotion[];

  constructor(initializer?: Invoice) {
    _.extend(this, initializer);
  }
}
