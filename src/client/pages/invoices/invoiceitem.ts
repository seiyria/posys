
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApplicationSettingsService } from '../../services/settings.service';
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
        <ion-col width-10 no-padding vertical-center>
          {{ settings.invoiceMethodDisplay(item.purchaseMethod) | truncate:10 }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
          {{ invoiceStatus(item) }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center text-right>
          {{ item.stockitems.length }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center text-right>
          {{ item.purchasePrice | currencyFromSettings }}
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

  constructor(public settings: ApplicationSettingsService) {}

  invoiceStatus(invoice: Invoice) {
    if(invoice.isOnHold)   { return 'On Hold'; }
    if(invoice.isReturned) { return 'Returned'; }
    if(invoice.isVoided)   { return 'Voided'; }
    return 'Completed';
  }
}
