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
      .getMany({ page: newPage, hideOutOfStock: +this.hideOutOfStock })
      .toPromise()
      .then(({ items, pagination }) => {
        this.currentInventoryItems = items;
        this.paginationInfo = pagination;
      });
  }

  openItemModal(item?: StockItem) {

    const openModal = (stockItem: StockItem) => {
      const modal = this.modalCtrl.create(InventoryManagerComponent, {
        stockItem: stockItem
      }, { enableBackdropDismiss: false });
      modal.onDidDismiss(() => {
        this.changePage(this.paginationInfo.page);
      });
      modal.present();
    };

    if(!item) { return openModal(new StockItem()); }

    this.siService
      .get(item)
      .toPromise()
      .then(stockItem => {
        openModal(stockItem);
      });
  }

  openOUModal() {
    const modal = this.modalCtrl.create(OUManagerComponent, {}, { enableBackdropDismiss: false });
    modal.present();
  }

  openQuickModal() {
    const modal = this.modalCtrl.create(QuickComponent, {}, { enableBackdropDismiss: false });
    modal.present();
  }

  toggleSearchResults(hasResults: boolean) {
    this.hasSearchResults = hasResults;
  }

  changeSearchResults(results: any) {
    this.searchResults = results.items;
  }

  importData() {

  }

  exportData() {

  }

}
