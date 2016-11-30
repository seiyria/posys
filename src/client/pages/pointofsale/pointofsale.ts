
import * as _ from 'lodash';

import { Component, EventEmitter } from '@angular/core';

import { ModalController, AlertController } from 'ionic-angular';

import { ApplicationSettingsService } from '../../services/settings.service';
import { StockItem } from '../../../models/stockitem';

@Component({
  selector: 'my-page-pointofsale',
  templateUrl: 'pointofsale.html',
  providers: [ApplicationSettingsService]
})
export class PointOfSalePageComponent {

  public currentTransaction: StockItem[] = [];
  public searchItems: StockItem[] = [];
  public showSearchItems: boolean;
  public omniCancelControl = new EventEmitter();

  constructor(public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public settings: ApplicationSettingsService) {

  }

  addTransactionItem(item: StockItem): void {

    // clone so we can set the quantity to 1
    const newItem = _.cloneDeep(item);
    newItem.quantity = 1;

    this.currentTransaction.push(newItem);
    // wait for next render cycle
    setTimeout(() => {
      const transactionList = document.getElementById('transaction-list');
      transactionList.scrollTop = transactionList.scrollHeight;
    });
  }

  addToTransaction($event): void {
    this.addTransactionItem($event);
    this.omniCancelControl.next();
  }

  voidTransaction(): void {
    const confirm = this.alertCtrl.create({
      title: 'Void transaction?',
      message: 'This is irreversible and unrecoverable. All items in the current transaction will be removed.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.currentTransaction = [];
          }
        }
      ]
    });
    confirm.present();
  }

  setShowResults($event): void {
    this.showSearchItems = $event;
  }

  setSearchResults($event): void {
    // 1 result + force = scanner input (or, they hit enter)
    if($event.items.length === 1 && $event.force) {
      this.addTransactionItem($event.items[0]);
      return;
    }

    this.searchItems = $event.items;
  }

  get subtotal(): number {
    return _.reduce(this.currentTransaction, (prev, cur) => prev + (cur.cost * cur.quantity), 0);
  }

  get subtotalTaxable(): number {
    return _.reduce(this.currentTransaction, (prev, cur) => prev + (cur.taxable ? (cur.cost * cur.quantity) : 0), 0);
  }

  get tax(): number {
    return (this.settings.taxRate / 100) * this.subtotalTaxable;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }
}
