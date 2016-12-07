
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

  handleSearchResults(result: any) {
    // TODO custom search support instead of requiring a scanner (maybe make this into a popup)
    if(result.items.length !== 1) { return; }
    this.scanItems.push(_.cloneDeep(result.items[0]));

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

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
