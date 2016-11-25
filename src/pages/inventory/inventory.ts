import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { InventoryManagerComponent } from './management/inventory.management';

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

}
