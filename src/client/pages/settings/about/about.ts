import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

declare const VERSION: string;

@Component({
  templateUrl: 'about.html'
})
export class AboutComponent {

  constructor(public viewCtrl: ViewController) {}

  get version() {
    return VERSION;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
