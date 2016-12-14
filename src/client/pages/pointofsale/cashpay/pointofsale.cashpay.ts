import * as _ from 'lodash';

import { Component } from '@angular/core';
import { ViewController, AlertController, NavParams } from 'ionic-angular';

import { CurrencyFromSettingsPipe } from '../../../pipes/currency-from-settings';

@Component({
  templateUrl: 'pointofsale.cashpay.html',
  providers: [CurrencyFromSettingsPipe]
})
export class CashPayComponent {

  public cashExpected: number;
  public cashPaid: string = '';

  public buttons = [7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, '<'];

  constructor(public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public currencyPipe: CurrencyFromSettingsPipe,
              public navParams: NavParams) {

    this.cashExpected = navParams.get('cashExpected');
  }

  adjustValue(newKey: string|number) {
    if(newKey === '<') {
      this.cashPaid = this.cashPaid.substring(0, this.cashPaid.length - 1);
      return;
    }

    this.cashPaid += newKey;
  }

  canPay() {
    return +this.cashPaid >= this.cashExpected;
  }

  dismiss(useValue?: boolean) {

    const cashPaid = +this.cashPaid;
    const diff = Math.abs(cashPaid - this.cashExpected);

    let message = `The customer has given ${this.currencyPipe.transform(cashPaid)} 
                   on a transaction worth ${this.currencyPipe.transform(this.cashExpected)}. `;
    if(diff === 0) {
      message += 'There is no change to be given.';
    } else {
      message += `There is ${this.currencyPipe.transform(diff)} due in change.`;
    }

    const confirm = this.alertCtrl.create({
      title: 'Finish Cash Pay?',
      message,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.viewCtrl.dismiss(cashPaid);
          }
        }
      ]
    });

    if(useValue) {
      confirm.present();
      return;
    }

    this.viewCtrl.dismiss();
  }

}
