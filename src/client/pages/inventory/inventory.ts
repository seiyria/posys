import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { InventoryManagerComponent } from './management/inventory.management';
import { OUManagerComponent } from './oumanage/ou.management';
import { QuickComponent } from './quick/quick';

import { StockItemService } from '../../services/stockitem.service';

import { StockItem } from '../../models/stockitem';
import { Pagination } from 'ionic2-pagination';

import { LocalStorage } from 'ng2-webstorage';

@Component({
  selector: 'my-page-inventory',
  templateUrl: 'inventory.html'
})
export class InventoryPageComponent implements OnInit {

  public currentInventoryItems: StockItem[] = [];
  public paginationInfo: Pagination;

  public hasSearchResults: boolean = false;
  public searchResults: StockItem[] = [];

  @LocalStorage()
  public hideOutOfStock: boolean;

  constructor(public modalCtrl: ModalController, public siService: StockItemService) {}

  ngOnInit() {
    this.changePage(1);
  }

  toggleOOS() {
    if(!this.paginationInfo) { return; }
    this.changePage(this.paginationInfo.page);
  }

  changePage(newPage) {
    this.siService
      .getMany({ page: newPage, pageSize: 25, hideOutOfStock: +this.hideOutOfStock })
      .toPromise()
      .then(({ items, pagination }) => {
        this.currentInventoryItems = items;
        this.paginationInfo = pagination;
      });
  }

  // TODO get item by id and use that instead of using the possibly more stale item passed in
  openItemModal(item?: StockItem) {
      let modal = this.modalCtrl.create(InventoryManagerComponent, {
          stockItem: _.cloneDeep(item) || new StockItem()
      });
      modal.onDidDismiss(() => {
        this.changePage(this.paginationInfo.page);
      });
      modal.present();
  }

  openOUModal() {
    let modal = this.modalCtrl.create(OUManagerComponent);
    modal.present();
  }

  openQuickModal() {
    let modal = this.modalCtrl.create(QuickComponent);
    modal.present();
  }

  toggleSearchResults(hasResults: boolean) {
    this.hasSearchResults = hasResults;
  }

  changeSearchResults(results: any) {
    this.searchResults = results.items;
  }

  // TODO do in a web worker (probably)
  importData() {

  }

  // TODO do in a web worker (probably)
  exportData() {

  }

}
