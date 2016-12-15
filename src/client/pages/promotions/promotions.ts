import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';

import { ModalController, AlertController } from 'ionic-angular';

import { Pagination } from 'ionic2-pagination';
import { LocalStorage } from 'ng2-webstorage';

import { Promotion } from '../../models/promotion';
import { PromotionService } from '../../services/promotion.service';
import { PromotionsManagerComponent } from './management/promotions.management';

@Component({
  selector: 'my-page-promotions',
  templateUrl: 'promotions.html'
})
export class PromotionsPageComponent implements OnInit {

  @LocalStorage()
  public hideCurrent: boolean;

  @LocalStorage()
  public hideFuture: boolean;

  @LocalStorage()
  public hidePast: boolean;

  public hasResults: boolean;

  public promotions = { past: [], current: [], future: [] };
  public paginationInfo: Pagination;

  constructor(public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public prService: PromotionService) {}

  ngOnInit() {
    this.changePage(1);
  }

  toggleHide() {
    if(!this.paginationInfo) { return; }
    this.changePage(this.paginationInfo.page);
  }

  categorizePromotions(promotions: Promotion[]) {
    const now = new Date();

    const pastPromotions = _.filter(promotions, promo => {
      return new Date(promo.endDate) < now;
    });

    const currentPromotions = _.filter(promotions, promo => {
      return new Date(promo.startDate) < now && new Date(promo.endDate) > now;
    });

    const futurePromotions = _.filter(promotions, promo => {
      return new Date(promo.startDate) > now;
    });

    this.hasResults = pastPromotions.length !== 0 || currentPromotions.length !== 0 || futurePromotions.length !== 0;

    this.promotions = {
      past: pastPromotions,
      current: currentPromotions,
      future: futurePromotions
    };
  }

  changePage(newPage) {
    this.prService
      .getMany({ page: newPage, hidePast: +this.hidePast, hideCurrent: +this.hideCurrent, hideFuture: +this.hideFuture })
      .toPromise()
      .then(({ items, pagination }) => {
        this.categorizePromotions(items);
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
