
import * as _ from 'lodash';

export type PurchaseMethod =
  'Cash' | 'Check' | 'Debit' | 'Credit';

export class Invoice {
  id?: number;
  purchaseTime: Date;
  purchaseMethod: PurchaseMethod;
  purchasePrice: number;
  cashGiven: number;
  isVoided: boolean;

  constructor(initializer?: Invoice) {
    _.extend(this, initializer);
  }
}
