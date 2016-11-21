import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'inventoryManager.html'
})
export class InventoryManagerComponent {

  constructor(public viewCtrl: ViewController) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
