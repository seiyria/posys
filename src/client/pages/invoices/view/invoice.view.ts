import * as _ from 'lodash';

import { Component } from '@angular/core';
import { ViewController, AlertController, LoadingController, App, NavParams } from 'ionic-angular';
import { Invoice } from '../../../models/invoice';

import { PointOfSalePageComponent } from '../../pointofsale/pointofsale';

import { ApplicationSettingsService } from '../../../services/settings.service';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  templateUrl: 'invoice.view.html'
})
export class InvoiceViewComponent {
  public invoice: Invoice;

  constructor(public viewCtrl: ViewController,
              public appCtrl: App,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public params: NavParams,
              public ivService: InvoiceService,
              public settings: ApplicationSettingsService) {

    this.invoice = params.get('invoice');
    _.each(this.invoice.stockitems, item => item.realData = this.invoiceItemData(item));
    _.each(this.invoice.promotions, item => item.realData = this.invoicePromoData(item));
    _.each(this.invoice.invoices,   invoice => {
      _.each(invoice.stockitems,    item => item.realData = this.invoiceItemData(item));
    });
  }

  printReceipt() {
    this.ivService
      .print(this.invoice, true)
      .toPromise();
  }

  invoiceItemData(item) {
    if(!_.isEmpty(item.stockitemData)) { return item.stockitemData; }
    return item._stockitemData;
  }

  invoicePromoData(item) {
    if(!_.isEmpty(item.promoData)) { return item.promoData; }
    return item._promoData;
  }

  totalItems() {
    return _.reduce(this.invoice.stockitems, (prev, cur) => prev + cur.quantity, 0);
  }

  resumeTransaction(isReturn = false) {
    const rootNav = this.appCtrl.getRootNav();
    rootNav
      .popToRoot()
      .then(() => {
      this.dismiss();
        rootNav.push(PointOfSalePageComponent, { prevInvoice: this.invoice, isReturn });
      });
  }

  dismiss(item?: Invoice) {
    this.viewCtrl.dismiss(item);
  }

  taxForItem(item): number {
    return (this.settings.taxRate / 100) * item.realData.cost * item.quantity;
  }

  totalCostForItem(item): number {
    return (item.realData.cost * item.quantity) + (item.taxable ? this.taxForItem(item) : 0);
  }

  canReturn() {
    const itemCount = _.sumBy(this.invoice.stockitems, 'quantity');
    const returnedItemCount = _.reduce(this.invoice.invoices, (prev, cur) => {
      return prev + _.sumBy(cur.stockitems, 'quantity');
    }, 0);

    return itemCount !== returnedItemCount;
  }

  returnedItems() {
    return _.compact(_.flattenDeep(_.map(this.invoice.invoices, 'stockitems')));
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
