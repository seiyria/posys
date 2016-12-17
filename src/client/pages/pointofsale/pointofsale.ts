
import * as _ from 'lodash';

import { Component, EventEmitter } from '@angular/core';

import { ModalController, AlertController } from 'ionic-angular';

import { InvoiceService } from '../../services/invoice.service';

import { CashPayComponent } from './cashpay/pointofsale.cashpay';

import { ApplicationSettingsService } from '../../services/settings.service';
import { StockItem } from '../../models/stockitem';
import { Promotion } from '../../models/promotion';
import { PurchaseMethod, Invoice } from '../../models/invoice';

@Component({
  selector: 'my-page-pointofsale',
  templateUrl: 'pointofsale.html',
  providers: [ApplicationSettingsService]
})
export class PointOfSalePageComponent {

  public currentTransaction: StockItem[] = [];
  public currentPromotions: Promotion[] = [];
  public searchItems: StockItem[] = [];
  public showSearchItems: boolean;
  public omniCancelControl = new EventEmitter();

  public transactionItemButtons = [
    { text: 'Discount', callback: (item) => {
    } },
    { text: 'Remove', callback: (item) => {
      const confirm = this.alertCtrl.create({
        title: `Remove "${item.name}"?`,
        message: 'This item will be removed from the current transaction.',
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Confirm',
            handler: () => {
              this.currentTransaction = _.reject(this.currentTransaction, i => i === item);
            }
          }
        ]
      });
      confirm.present();
    } }
  ];

  constructor(public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public ivService: InvoiceService,
              public settings: ApplicationSettingsService) {}

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

  private clearTransaction() {
    this.currentTransaction = [];
    this.currentPromotions = [];
  }

  voidTransaction(): void {
    const confirm = this.alertCtrl.create({
      title: 'Void Transaction?',
      message: 'This is irreversible and unrecoverable. All items in the current transaction will be removed.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.clearTransaction();
          }
        }
      ]
    });
    confirm.present();
  }

  returnItems(): void {
    const confirm = this.alertCtrl.create({
      title: 'Return Items?',
      message: 'This will create an invoice with a negative value. All promotions will be removed from this transaction.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.createInvoice({
              purchaseMethod: 'Return',
              purchasePrice: -this.total
            });
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
  }

  getCashValue() {
    const modal = this.modalCtrl.create(CashPayComponent, {
      cashExpected: this.total
    }, { enableBackdropDismiss: false });
    modal.onDidDismiss((cashGiven) => {
      if(!cashGiven) { return; }
      this.finalize('Cash', cashGiven);
    });
    modal.present();
  }

  finalize(purchaseMethod: PurchaseMethod, cashGiven?: number) {
    const confirm = this.alertCtrl.create({
      title: 'Complete Transaction?',
      message: `You are doing a ${purchaseMethod} transaction with a value of $${this.total} across 
                ${this.currentTransaction.length} items with ${this.currentPromotions.length} promotions.`,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.createInvoice({
              purchaseMethod,
              cashGiven,
              purchasePrice: this.total,
              promotions: this.currentPromotions
            });
          }
        }
      ]
    });
    confirm.present();
  }

  createInvoice(opts) {
    opts.purchaseTime = new Date();
    opts.stockitems = this.currentTransaction;
    const invoice = new Invoice(opts);

    this.ivService
      .create(invoice)
      .toPromise()
      .then(newInvoice => {
        this.clearTransaction();
      });
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
    return +((this.subtotal + this.tax).toFixed(2));
  }
}
