import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'about.html'
})
export class AboutComponent {

  constructor(public viewCtrl: ViewController) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
