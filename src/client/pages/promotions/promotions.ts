import { Component, OnInit } from '@angular/core';

import { ModalController } from 'ionic-angular';

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

  constructor(public modalCtrl: ModalController, public prService: PromotionService) {}

  ngOnInit() {
    // this.changePage(1);
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

}
