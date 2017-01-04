
import * as _ from 'lodash';

import { Promotion } from './promotion';

export class InvoicePromo {
  id?: number;
  invoiceId?: number;
  promoId?: number;
  promoData?: Promotion;
  cost?: number;
  skus?: string[];

  realData?: any;

  applyId?: string;

  constructor(initializer?: InvoicePromo) {
    if(!initializer) { return; }
    this.id = initializer.id;
    this.invoiceId = initializer.invoiceId;
    this.promoId = initializer.promoId;
    this.promoData = initializer.promoData;
    this.cost = initializer.cost;
    this.skus = initializer.skus;
    this.applyId = initializer.applyId;
  }
}
