import { Component, OnInit } from '@angular/core';

import { ModalController, AlertController } from 'ionic-angular';

import { Pagination } from 'ionic2-pagination';

import { Promotion } from '../../models/promotion';
import { PromotionService } from '../../services/promotion.service';
import { PromotionsManagerComponent } from './management/promotions.management';

@Component({
  selector: 'my-page-promotions',
  templateUrl: 'promotions.html'
})
export class PromotionsPageComponent implements OnInit {

  public currentPromotions: Promotion[] = [];
  public paginationInfo: Pagination;

  constructor(public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public prService: PromotionService) {}

  ngOnInit() {
    this.changePage(1);
  }

  changePage(newPage) {
    this.prService
      .getMany({ page: newPage })
      .toPromise()
      .then(({ items, pagination }) => {
        this.currentPromotions = items;
        this.paginationInfo = pagination;
      });
  }

  openPromoModal(promo?: Promotion) {

    const openModal = (promoItem: Promotion) => {
      const modal = this.modalCtrl.create(PromotionsManagerComponent, {
        promotion: promoItem
      }, { enableBackdropDismiss: false });
      modal.onDidDismiss(() => {
        this.changePage(this.paginationInfo.page);
      });
      modal.present();
    };

    if(!promo) { return openModal(new Promotion()); }

    this.prService
      .get(promo)
      .toPromise()
      .then(promotion => {
        openModal(promotion);
      });
  }

  removePromo(item) {
    const confirm = this.alertCtrl.create({
      title: `Remove Promotion "${item.name}"?`,
      message: 'This is irreversible and unrecoverable. This promotion will be removed.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.prService
              .remove(item)
              .toPromise()
              .then(() => {
                this.changePage(this.paginationInfo.page);
              });
          }
        }
      ]
    });
    confirm.present();
  }

}
