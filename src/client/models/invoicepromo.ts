
import * as _ from 'lodash';

import { Promotion } from './promotion';

export class InvoicePromo {
  id?: number;
  promoId?: number;
  promoData?: Promotion;

  constructor(initializer?: Promotion) {
    _.extend(this, initializer);
  }
}
