
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'inventory-item',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col width-33 no-padding>
          <ion-row>
            <ion-col no-padding>{{ item.name | truncate:50 }}</ion-col>
          </ion-row>
          <ion-row background-text>
            <ion-col no-padding>{{ item.description | truncate:50 }}</ion-col>
          </ion-row>
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
          {{ item.organizationalunit.name | truncate:15 }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
          {{ item.sku }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center text-right>
          {{ item.quantity }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center text-right>
          {{ item.vendorPurchasePrice | currencyFromSettings }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center text-right>
          {{ item.cost | currencyFromSettings }}
        </ion-col>
        <ion-col no-padding vertical-center text-right>
          <edit-button (click)="edit.next()"></edit-button>
        </ion-col>
      </ion-row>
    </ion-grid>
`,
})
export class InventoryItemComponent {
  @Input() item: StockItem;
  @Output() edit = new EventEmitter();
}
