
import * as _ from 'lodash';

import { OrganizationalUnit } from './organizationalunit';
import { PromoItem } from './promoitem';
import { InvoicePromo } from './invoicepromo';

export type DiscountType =
  'Dollar' | 'Percent';

export type ItemReductionType =
  'BuyXGetNext' | 'All';

export type DiscountGrouping =
  'SKU' | 'OU'

export class Promotion {
  id?: number;
  name: string;
  description?: string;
  discountType: DiscountType;
  itemReductionType: ItemReductionType;
  discountGrouping: DiscountGrouping;

  discountValue: number;
  numItemsRequired: number;

  startDate?: string;
  endDate?: string;

  organizationalunitId?: number;
  organizationalunit?: OrganizationalUnit;

  promoItems?: PromoItem[];
  invoicePromos?: InvoicePromo[];

  temporary?: boolean;

  constructor(initializer?: Promotion) {
    _.assign(this, initializer);

    if(this.name) {
      this.name = this.name.trim();
    }

    if(this.description) {
      this.description = this.description.trim();
    }
  }
}
