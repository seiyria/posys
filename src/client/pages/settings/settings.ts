import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { AboutComponent } from './about/about';
import { EditSettingsComponent } from './edit/editsettings';
import { AuditPageComponent } from './audit/audit';
import { ErrorPageComponent } from './error/error';

@Component({
  selector: 'my-page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPageComponent {

  constructor(public modalCtrl: ModalController, public navCtrl: NavController) {}

  openEdit() {
    let modal = this.modalCtrl.create(EditSettingsComponent, { enableBackdropDismiss: false });
    modal.present();
  }

  openAbout() {
    let modal = this.modalCtrl.create(AboutComponent, { enableBackdropDismiss: false });
    modal.present();
  }

  openAuditLog() {
    this.navCtrl.push(AuditPageComponent);
  }

  openErrorLog() {
    this.navCtrl.push(ErrorPageComponent);
  }

}
