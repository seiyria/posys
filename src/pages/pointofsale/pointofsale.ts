import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'my-page-pointofsale',
  templateUrl: 'pointofsale.html'
})
export class PointOfSaleComponent {

  private currentTransaction: StockItem[] = [];
  private searchItems: StockItem[] = [];
  private showSearchItems: boolean;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController) {

  }

  addTransactionItem(item: StockItem) {
    this.currentTransaction.push(item);
    const transactionList = document.getElementById('transaction-list');
    transactionList.scrollTop = transactionList.scrollHeight;
  }

  setShowResults($event) {
    this.showSearchItems = $event;
  }

  setSearchResults($event) {
    // 1 result + force = scanner input (or, they hit enter)
    if($event.items.length === 1 && $event.force) {
      this.addTransactionItem($event.items[0]);
      return;
    }

    this.searchItems = $event.items;
  }
}
