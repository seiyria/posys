import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { ApplicationSettingsService, Settings } from '../../../services/settings.service';

const cc = require('currency-codes');

@Component({
  templateUrl: 'editsettings.html'
})
export class EditSettingsComponent implements OnInit {

  public settings: Settings = new Settings({});
  public currencyCodes = cc.codes();

  constructor(public viewCtrl: ViewController, public settingsService: ApplicationSettingsService) {}

  ngOnInit() {
    this.settings = new Settings(this.settingsService.settings);
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
