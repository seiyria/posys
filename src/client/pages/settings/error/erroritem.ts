
import { Component, Input } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { ErrorMessage } from '../../../models/errormessage';

@Component({
  selector: 'error-item',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col width-20 no-padding>
          {{ item.created_at | date:'medium' }}
        </ion-col>
        <ion-col no-padding vertical-center>
          <button ion-button icon-only small round color="danger" (click)="showStack()">
            <ion-icon name="code-working"></ion-icon>
          </button>
          &nbsp;
          {{ item.message | truncate:75 }}
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
export class ErrorItemComponent {
  @Input() item: ErrorMessage;

  constructor(private alertCtrl: AlertController) {}

  showStack() {
    let alert = this.alertCtrl.create({
      title: 'Error Stack Trace',
      subTitle: this.item.stack,
      cssClass: 'stack-trace-alert',
      buttons: ['Close']
    });
    alert.present();
  }
}
