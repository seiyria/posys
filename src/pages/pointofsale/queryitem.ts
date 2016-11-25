
import { Component, Input } from '@angular/core';

import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'my-query-item',
  template: `
    <ion-grid>
      <ion-row>
        <ion-col>
        {{ item | json }}
          {{ item.name }} {{ item.quantity }}
        </ion-col>
      </ion-row>
    </ion-grid>
`,
})
export class QueryItemComponent {
  @Input() item: StockItem;

  constructor() {}

}
