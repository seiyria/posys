import { Component, OnInit } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';

import { ApplicationSettingsService } from '../../../services/settings.service';
import { LocationService } from '../../../services/location.service';
import { Settings } from '../../../models/settings';

import { LocationManagerComponent } from '../locationmanage/location.management';

const cc = require('currency-codes');

@Component({
  templateUrl: 'editsettings.html'
})
export class EditSettingsComponent implements OnInit {

  public settings: Settings = new Settings({});
  public currencyCodes = cc.codes();

  public printers: any[];
  public locations: any[];

  constructor(public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public locationService: LocationService,
              public settingsService: ApplicationSettingsService) {}

  ngOnInit() {
    this.settings = new Settings(this.settingsService.settings);
    this.refreshPrinters();
    this.refreshLocations();
  }

  refreshPrinters() {
    this.settingsService
      .getAllPrinters()
      .toPromise()
      .then(printers => {
        this.printers = printers;
      });
  }

  manageLocations() {
    let modal = this.modalCtrl.create(LocationManagerComponent, { enableBackdropDismiss: false });
    modal.onDidDismiss(() => {
      this.refreshLocations();
    });
    modal.present();
  }

  refreshLocations() {
    this.locationService
      .getAll()
      .toPromise()
      .then(locations => {
        this.locations = locations;
      });
  }

  saveSettings() {
    this.settingsService
      .changeSettings(this.settings)
      .then(() => this.dismiss());
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
