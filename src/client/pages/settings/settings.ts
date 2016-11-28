import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { AboutComponent } from './about/about';

@Component({
  selector: 'my-page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPageComponent {

  constructor(public modalCtrl: ModalController) {

  }

  openAbout() {
    let modal = this.modalCtrl.create(AboutComponent);
    modal.present();
  }

}
