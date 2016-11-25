
import { Component, Input } from '@angular/core';

import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'my-transaction-item',
  template: `
    <ion-grid>
      <ion-row>
        <ion-col>
        {{ item | json }}
          {{ item.name }}
        </ion-col>
      </ion-row>
    </ion-grid>
`,
})
export class TransactionItemComponent {
  @Input() item: StockItem;

  constructor() {}

}
