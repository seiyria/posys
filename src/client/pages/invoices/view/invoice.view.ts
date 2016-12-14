import * as _ from 'lodash';

import { Component } from '@angular/core';
import { ViewController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Invoice } from '../../../models/invoice';

import { ApplicationSettingsService } from '../../../services/settings.service';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  templateUrl: 'invoice.view.html'
})
export class InvoiceViewComponent {
  public invoice: Invoice;

  constructor(public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public params: NavParams,
              public ivService: InvoiceService,
              public settings: ApplicationSettingsService) {

    this.invoice = params.get('invoice');
    _.each(this.invoice.stockitems, item => item.realData = this.invoiceItemData(item));
    _.each(this.invoice.promotions, item => item.realData = this.invoicePromoData(item));

    // TODO fold invoice items into item-quantity to take up less vertical space and make more sense
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

    const voidText = 'Are you sure you want to void this transaction? It will re-stock the items listed in the invoice.';
    const unvoidText = 'Are you sure you want to un-void this transaction? It will again deduct the items listed in the invoice.';

    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    const confirm = this.alertCtrl.create({
      title: `${this.invoice.isVoided ? 'Un-void' : 'Void'} Invoice?`,
      message: this.invoice.isVoided ? unvoidText : voidText,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            loading.present();

            this.ivService
              .toggleVoid(this.invoice)
              .toPromise()
              .then(res => {
                this.invoice.isVoided = res.isVoided;
                loading.dismiss();
              });
          }
        }
      ]
    });

    confirm.present();
  }

}
