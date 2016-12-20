import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { AboutComponent } from './about/about';
import { EditSettingsComponent } from './edit/editsettings';

@Component({
  selector: 'my-page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPageComponent {

  constructor(public modalCtrl: ModalController) {}

  openEdit() {
    let modal = this.modalCtrl.create(EditSettingsComponent, { enableBackdropDismiss: false });
    modal.present();
  }

  openAbout() {
    let modal = this.modalCtrl.create(AboutComponent, { enableBackdropDismiss: false });
    modal.present();
  }

}
