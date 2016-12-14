
import { Component, Input, OnInit } from '@angular/core';
import { PopoverController, ViewController, NavParams } from 'ionic-angular';

import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'transaction-item',
  template: `
    <ion-grid no-padding>
      <ion-row>
        <ion-col width-10 no-padding vertical-center space-between-col>
          #{{ index }}
          
          <button ion-button icon-only clear color="dark" (click)="moreOptions($event)" *ngIf="buttons.length > 0">
            <ion-icon name="more"></ion-icon>
          </button>
        </ion-col>
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
          <update-quantity-button [quantity]="item.quantity" (quantityChange)="updateQuantity($event, item)"></update-quantity-button>
        </ion-col>
        <ion-col width-10 no-padding vertical-center>
          <ion-item shrunk-item-checkbox no-border-bottom>
            <ion-label>{{ item.cost | currencyFromSettings }}</ion-label>
            <ion-checkbox color="primary" [(ngModel)]="item.taxable"></ion-checkbox>
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
export class TransactionItemComponent {
  @Input() item: StockItem;
  @Input() buttons: any[];
  @Input() index: number;

  constructor(public popoverCtrl: PopoverController) {}

  updateQuantity(quantity, item) {
    item.quantity = quantity;
  }

  moreOptions($event) {
    const popover = this.popoverCtrl.create(TransactionItemPopoverComponent, { buttons: this.buttons, item: this.item });

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
export class TransactionItemPopoverComponent implements OnInit {
  public buttons: any[];
  private item: StockItem;

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
