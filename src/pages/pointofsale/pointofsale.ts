import _ from 'lodash';

import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import { ApplicationSettingsService } from '../../services/settings.service';
import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'my-page-pointofsale',
  templateUrl: 'pointofsale.html',
  providers: [ApplicationSettingsService]
})
export class PointOfSaleComponent {

  private currentTransaction: StockItem[] = [];
  private searchItems: StockItem[] = [];
  private showSearchItems: boolean;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public settings: ApplicationSettingsService) {

  }

  addTransactionItem(item: StockItem): void {
    this.currentTransaction.push(item);
    // wait for next render cycle
    setTimeout(() => {
      const transactionList = document.getElementById('transaction-list');
      transactionList.scrollTop = transactionList.scrollHeight;
    });
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

  get tax(): number {
    return (this.settings.taxRate / 100) * this.subtotal;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }
}
