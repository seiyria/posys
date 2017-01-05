
import { Component, Input } from '@angular/core';

import { AuditMessage } from '../../../models/auditmessage';

@Component({
  selector: 'audit-item',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col width-20 no-padding>
          {{ item.created_at | date:'medium' }}
        </ion-col>
        <ion-col no-padding vertical-center>
          {{ item.message }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
          {{ item.module }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
          {{ item.location.name }}
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
          {{ item.terminalId }}
        </ion-col>
      </ion-row>
    </ion-grid>
`,
})
export class AuditItemComponent {
  @Input() item: AuditMessage;
}
