import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AboutComponent } from './about/about';
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'my-page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPageComponent {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }

  openAbout() {
    let modal = this.modalCtrl.create(AboutComponent);
    modal.present();
  }

}
