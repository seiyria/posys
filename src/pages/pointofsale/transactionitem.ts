
import { Component, Input } from '@angular/core';

import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'transaction-item',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col width-10 no-padding>
          #{{ index }}
        </ion-col>
        <ion-col width-50 no-padding>
          <ion-row>
            <ion-col no-padding>{{ item.name | truncate:50 }}</ion-col>
          </ion-row>
          <ion-row background-text>
            <ion-col no-padding>{{ item.description | truncate:50 }}</ion-col>
          </ion-row>
        </ion-col>
        <ion-col width-20 no-padding>
          {{ item.sku }}
        </ion-col>
        <ion-col width-10 no-padding>
          {{ item.quantity }}
        </ion-col>
        <ion-col width-10 no-padding>
          <ion-item shrunk-item-checkbox no-border-bottom>
            <ion-label>{{ item.cost | currencyFromSettings }}</ion-label>
            <ion-checkbox color="primary" [(ngModel)]="item.taxable"></ion-checkbox>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
`,
})
export class TransactionItemComponent {
  @Input() item: StockItem;
  @Input() index: number;

  constructor() {}

}
