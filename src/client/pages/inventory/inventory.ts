import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { InventoryManagerComponent } from './management/inventory.management';
import { OUManagerComponent } from './oumanage/ou.management';

import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'my-page-inventory',
  templateUrl: 'inventory.html'
})
export class InventoryPageComponent {

  constructor(public modalCtrl: ModalController) {
  }

  openNewModal() {
      let modal = this.modalCtrl.create(InventoryManagerComponent, {
          stockItem: new StockItem()
      });
      modal.present();
  }

  openOUModal() {
    let modal = this.modalCtrl.create(OUManagerComponent, {
      stockItem: new StockItem()
    });
    modal.present();
  }

  // TODO do in a web worker (probably)
  importData() {

  }

  // TODO do in a web worker (probably)
  exportData() {

  }

}
