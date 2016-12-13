import { Component, OnInit } from '@angular/core';

import { ModalController } from 'ionic-angular';
import { Pagination } from 'ionic2-pagination';

import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice';

@Component({
  selector: 'my-page-invoices',
  templateUrl: 'invoices.html'
})
export class InvoicesPageComponent implements OnInit {

  public currentInvoices: Invoice[] = [];
  public paginationInfo: Pagination;

  constructor(public modalCtrl: ModalController, public ivService: InvoiceService) {}

  ngOnInit() {
    this.changePage(1);
  }

  changePage(newPage) {
    this.ivService
      .getMany({ page: newPage })
      .toPromise()
      .then(({ items, pagination }) => {
        this.currentInvoices = items;
        this.paginationInfo = pagination;
      });
  }

  openItemModal(item?: Invoice) {

    /*
    const openModal = (invoice: Invoice) => {
      const modal = this.modalCtrl.create(InventoryManagerComponent, {
        invoice: invoice
      }, { enableBackdropDismiss: false });
      modal.onDidDismiss(() => {
        this.changePage(this.paginationInfo.page);
      });
      modal.present();
    };

    openModal(item);
    */
  }

}
