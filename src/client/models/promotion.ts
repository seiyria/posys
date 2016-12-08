
import * as _ from 'lodash';

import { OrganizationalUnit } from './organizationalunit';
import { PromoItem } from './promoitem';

export type DiscountType =
  'Dollar' | 'Percent';

export type ItemReductionType =
  'BuyXGetNext' | 'All';

export class Promotion {
  id?: number;
  name: string;
  description?: string;
  discountType: DiscountType;
  itemReductionType: ItemReductionType;

  discountValue: number;
  numItemsRequired: number;

  startDate?: string;
  endDate?: string;

  organizationalunitId?: number;
  organizationalunit?: OrganizationalUnit;

  promoItems?: PromoItem[];

  temporary?: boolean;

  constructor(initializer?: Promotion) {
    _.assign(this, initializer);
  }
}
