import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

@Component({
  selector: 'my-page-pointofsale',
  templateUrl: 'pointofsale.html'
})
export class PointOfSaleComponent {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }
}
