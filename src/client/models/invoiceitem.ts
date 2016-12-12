
import * as _ from 'lodash';

import { StockItem } from './stockitem';

export class InvoiceItem {
  id?: number;
  invoiceId?: number;
  stockitemId?: number;
  stockitemData?: StockItem;

  constructor(initializer?: InvoiceItem) {
    if(!initializer) return;
    this.id = initializer.id;
    this.invoiceId = initializer.invoiceId;
    this.stockitemId = initializer.stockitemId;
    this.stockitemData = initializer.stockitemData;
  }
}
