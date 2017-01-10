import { Component, OnInit } from '@angular/core';

import { ModalController } from 'ionic-angular';
import { Pagination } from 'ionic2-pagination';
import { LocalStorage } from 'ng2-webstorage';

import { InvoiceViewComponent } from './view/invoice.view';

import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice';

@Component({
  selector: 'my-page-invoices',
  templateUrl: 'invoices.html'
})
export class InvoicesPageComponent implements OnInit {

  @LocalStorage()
  public earliestDate: string;

  @LocalStorage()
  public latestDate: string;

  @LocalStorage()
  public hideVoided: boolean;

  @LocalStorage()
  public hideHolds: boolean;

  @LocalStorage()
  public hideReturns: boolean;

  @LocalStorage()
  public hideCompleted: boolean;

  public currentInvoices: Invoice[] = [];
  public paginationInfo: Pagination;

  constructor(public modalCtrl: ModalController, public ivService: InvoiceService) {}

  ngOnInit() {
    this.changePage(1);
  }

  unsetDate(type: string) {
    this[type] = '';
    this.toggleFilter();
  }

  toggleFilter() {
    if(!this.paginationInfo) { return; }
    this.changePage(this.paginationInfo.page);
  }

  changePage(newPage) {
    this.ivService
      .getMany({
        page: newPage,
        earliestDate: this.earliestDate,
        latestDate: this.latestDate,
        hideVoided: +this.hideVoided,
        hideHolds: +this.hideHolds,
        hideReturns: +this.hideReturns,
        hideCompleted: +this.hideCompleted
      })
      .toPromise()
      .then(({ items, pagination }) => {
        this.currentInvoices = items;
        this.paginationInfo = pagination;
      });
  }

  openItemModal(item?: Invoice) {

    const openModal = (invoice: Invoice) => {
      const modal = this.modalCtrl.create(InvoiceViewComponent, {
        invoice: invoice
      }, { enableBackdropDismiss: false });
      modal.onDidDismiss(() => {
        this.changePage(this.paginationInfo.page);
      });
      modal.present();
    };

    this.ivService
      .get(item)
      .toPromise()
      .then(invoice => {
        openModal(invoice);
      });
  }

}
