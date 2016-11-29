
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { StockItem } from '../../../models/stockitem';

@Component({
  selector: 'query-item',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col width-50 no-padding>
          <ion-row>
            <ion-col no-padding>{{ item.name | truncate:50 }}</ion-col>
          </ion-row>
          <ion-row background-text>
            <ion-col no-padding>{{ item.description | truncate:50 }}</ion-col>
          </ion-row>
        </ion-col>
        <ion-col width-20 no-padding vertical-center>
          {{ item.sku }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
          {{ item.cost | currencyFromSettings }}
        </ion-col>
        <ion-col width-20 no-padding text-right>
          <button ion-button icon-only round no-margin (click)="choose.next(item)">
            <ion-icon name="checkmark-circle"></ion-icon>
          </button>
        </ion-col>
      </ion-row>
    </ion-grid>
`,
})
export class QueryItemComponent {
  @Input() item: StockItem;
  @Output() choose = new EventEmitter();
}
