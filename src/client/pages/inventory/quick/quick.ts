
import * as _ from 'lodash';

import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { StockItem } from '../../../models/stockitem';

import { StockItemService } from '../../../services/stockitem.service';

@Component({
  templateUrl: 'quick.html'
})
export class QuickComponent {

  public scanItems: StockItem[] = [];

  constructor(public viewCtrl: ViewController,
              public siService: StockItemService) {}

  handleSingleSearchResult(result: any) {
    this.handleSearchResults({ items: [result] });
  }

  handleSearchResults(result: any) {
    if(result.items.length !== 1) { return; }
    const newItem = _.cloneDeep(result.items[0]);
    newItem.quantity = 1;
    this.scanItems.push(newItem);

    setTimeout(() => {
      const transactionList = document.getElementById('scan-list');
      transactionList.scrollTop = transactionList.scrollHeight;
    });
  }

  removeItem(item: StockItem) {
    this.scanItems = _.reject(this.scanItems, i => i === item);
  }

  importItems() {
    this.siService
      .importMany(this.scanItems)
      .toPromise()
      .then(() => {
        this.dismiss();
      });
  }

  updateQuantity(newQuantity, item) {
    item.quantity = newQuantity;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
