import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { InventoryManagerComponent } from './management/inventory.management';
import { OUManagerComponent } from './oumanage/ou.management';

import { StockItemService } from '../../services/stockitem.service';

import { StockItem } from '../../models/stockitem';
import { Pagination } from 'ionic2-pagination';

@Component({
  selector: 'my-page-inventory',
  templateUrl: 'inventory.html'
})
export class InventoryPageComponent implements OnInit {

  public currentInventoryItems: StockItem[] = [];
  public paginationInfo: Pagination;

  constructor(public modalCtrl: ModalController, public siService: StockItemService) {}

  ngOnInit() {
    this.changePage(1);
  }

  changePage(newPage) {
    this.siService
      .getMany({ page: newPage, pageSize: 25 })
      .toPromise()
      .then(({ items, pagination }) => {
        this.currentInventoryItems = items;
        this.paginationInfo = pagination;
      });
  }

  openItemModal(item: StockItem|null) {
      let modal = this.modalCtrl.create(InventoryManagerComponent, {
          stockItem: _.cloneDeep(item) || new StockItem()
      });
      modal.onDidDismiss(data => {
        this.changePage(this.paginationInfo.page);
      });
      modal.present();
  }

  openOUModal() {
    let modal = this.modalCtrl.create(OUManagerComponent);
    modal.present();
  }

  // TODO do in a web worker (probably)
  importData() {

  }

  // TODO do in a web worker (probably)
  exportData() {

  }

}
