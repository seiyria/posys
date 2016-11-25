
import { Component, Input } from '@angular/core';

import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'transaction-item',
  template: `
    <ion-grid>
      <ion-row>
        <ion-col>
          #{{ index }}
        </ion-col>
        <ion-col>
          {{ item.name }}
        </ion-col>
        <ion-col>
          {{ item.name }}
        </ion-col>
        <ion-col>
          {{ item.name }}
        </ion-col>
        <ion-col>
          {{ item.name }}
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
