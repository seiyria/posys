import * as _ from 'lodash';

import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Invoice } from '../../../models/invoice';

import { ApplicationSettingsService } from '../../../services/settings.service';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  templateUrl: 'invoice.view.html'
})
export class InvoiceViewComponent {
  public invoice: Invoice;

  // public _formErrors: BehaviorSubject<any> = new BehaviorSubject({});
  // public formErrors: Observable<any> = this._formErrors.asObservable();

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public ivService: InvoiceService,
              public settings: ApplicationSettingsService) {

    this.invoice = params.get('invoice');
    _.each(this.invoice.stockitems, item => item.realData = this.invoiceItemData(item));
    _.each(this.invoice.promotions, item => item.realData = this.invoicePromoData(item));
    console.log(this.invoice);
  }

  invoiceItemData(item) {
    return item.stockitemData || item._stockitemData;
  }

  invoicePromoData(item) {
    return item._promoData || item.promoData;
  }

  dismiss(item?: Invoice) {
    this.viewCtrl.dismiss(item);
  }

  taxForItem(item): number {
    return (this.settings.taxRate / 100) * item.cost;
  }

  toggleVoid() {

  }

  /* update() {
    this.ivService
      .update(this.stockItem)
      .subscribe(() => {
        this._formErrors.next({});
        this.dismiss(this.stockItem);
      }, e => this._formErrors.next(e.formErrors));
  }
  */

}
