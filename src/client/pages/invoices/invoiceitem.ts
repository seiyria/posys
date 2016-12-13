
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Invoice } from '../../models/invoice';

@Component({
  selector: 'invoice-item',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col width-10 no-padding vertical-center>
          {{ item.id }}
        </ion-col>
        <ion-col width-20 no-padding vertical-center>
          {{ item.purchaseTime | date:'medium' }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center text-right>
          {{ item.stockitems.length }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center text-right>
          {{ item.purchasePrice | currencyFromSettings }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center text-right>
          {{ item.purchaseMethod }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center text-right>
          {{ item.isVoided ? 'Yes' : 'No' }}
        </ion-col>
        <ion-col no-padding vertical-center text-right>
          <view-button (click)="view.next()"></view-button>
        </ion-col>
      </ion-row>
    </ion-grid>
`,
})
export class InvoiceItemComponent {
  @Input() item: Invoice;
  @Output() view = new EventEmitter();
}
