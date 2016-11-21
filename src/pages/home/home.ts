import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { InventoryPageComponent } from '../inventory/inventory';
import { SettingsPageComponent } from '../settings/settings';

@Component({
  selector: 'my-page-home',
  templateUrl: 'home.html'
})
export class HomePageComponent {

  constructor(public navCtrl: NavController) {

  }

  goToInventory() {
    this.navCtrl.push(InventoryPageComponent);
  }

  goToSettings() {
    this.navCtrl.push(SettingsPageComponent);
  }

}
