
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ToastController } from 'ionic-angular';

@Injectable()
export class LoggerService {
  constructor(public toastCtrl: ToastController) {}

  error(e: Error|Response): void {

    let errMsg: string;

    if (e instanceof Response) {
      const body = e.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${e.status} - ${e.statusText || ''} ${err}`;
    } else {
      errMsg = e.message ? e.message : e.toString();
    }

    console.error(errMsg);
  }

  observableError(e: Error|Response) {
    this.error(e);
    let returnedValue = e instanceof Response ? e.json() : e;

    if(returnedValue.flash) {
      this.toastCtrl.create({
        message: returnedValue.flash,
        duration: 5000,
        position: 'top',
        showCloseButton: true
      }).present();
    }

    return Observable.throw(returnedValue);
  }
}
