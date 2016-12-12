
import * as _ from 'lodash';

import { StockItem } from './stockitem';

export class InvoiceItem {
  id?: number;
  stockitemId?: number;
  stockitemData?: StockItem;

  constructor(initializer?: InvoiceItem) {
    _.extend(this, initializer);
  }
}
