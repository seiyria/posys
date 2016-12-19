
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PopoverController, ViewController, NavParams } from 'ionic-angular';

import { InvoicePromo } from '../../models/invoicepromo';

@Component({
  selector: 'transaction-promo',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col width-10 no-padding vertical-center space-between-col>
          #{{ index }}
          
          <button ion-button icon-only clear color="dark" (click)="moreOptions($event)" [attr.invisible]="buttons.length === 0">
            <ion-icon name="more"></ion-icon>
          </button>
        </ion-col>
        <ion-col width-50 no-padding>
          <ion-row>
            <ion-col no-padding>{{ item.realData.name | truncate:50 }}</ion-col>
          </ion-row>
          <ion-row background-text>
            <ion-col no-padding>{{ item.realData.description | truncate:50 }}</ion-col>
          </ion-row>
        </ion-col>
        <ion-col width-20 no-padding vertical-center>
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
          <ion-item shrunk-item-checkbox no-border-bottom>
            <ion-label text-right>{{ item.cost | currencyFromSettings }}</ion-label>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>
`,
  styles: [`
    [space-between-col] {
      justify-content: space-around;
    }
  `]
})
export class TransactionPromoComponent {
  @Input() item: InvoicePromo;
  @Input() buttons: any[];
  @Input() index: number;

  constructor(public popoverCtrl: PopoverController) {}

  moreOptions($event) {
    const popover = this.popoverCtrl.create(TransactionPromoPopoverComponent, { buttons: this.buttons, item: this.item });

    popover.present({
      ev: $event
    });
  }
}

@Component({
  template: `
    <ion-list no-margin-bottom>
      <ion-item *ngFor="let button of buttons" (click)="doCallback(button)">
        {{ button.text }}
      </ion-item>
    </ion-list>
  `
})
export class TransactionPromoPopoverComponent implements OnInit {
  public buttons: any[];
  private item: InvoicePromo;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {}

  ngOnInit() {
    this.buttons = this.navParams.data.buttons;
    this.item = this.navParams.data.item;
  }

  doCallback(button) {
    button.callback(this.item);
    this.viewCtrl.dismiss();
  }
}
