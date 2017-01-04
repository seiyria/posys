
import * as _ from 'lodash';

import { InvoiceItem } from './invoiceitem';
import { InvoicePromo } from './invoicepromo';

export type PurchaseMethod =
  'Cash' | 'Check' | 'Debit' | 'Credit' | 'Custom' | 'Return' | 'Void';

export class Invoice {
  id?: number;
  purchaseTime: Date;
  purchaseMethod: PurchaseMethod;
  purchasePrice: number;
  cashGiven?: number;
  taxCollected?: number;
  subtotal?: number;
  isVoided?: boolean;
  isReturned?: boolean;
  isOnHold?: boolean;

  locationName?: string;
  terminalId?: string;

  previousId?: number;

  stockitems?: InvoiceItem[];
  promotions?: InvoicePromo[];

  constructor(initializer?: Invoice) {
    _.extend(this, initializer);
  }
}
