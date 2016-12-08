import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { Promotion } from '../../../models/promotion';
import { PromoItem } from '../../../models/promoitem';
import { OrganizationalUnit } from '../../../models/organizationalunit';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { PromotionService } from '../../../services/promotion.service';
import { OrganizationalUnitService } from '../../../services/organizationalunit.service';

@Component({
  templateUrl: 'promotions.management.html'
})
export class PromotionsManagerComponent implements OnInit {
  public promotion: Promotion;
  public allOU: Observable<OrganizationalUnit[]>;
  public today: string;
  public futureToday: string;

  public discountItems: string;

  public _formErrors: BehaviorSubject<any> = new BehaviorSubject({});
  public formErrors: Observable<any> = this._formErrors.asObservable();

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public prService: PromotionService,
              public ouService: OrganizationalUnitService) {

    this.promotion = params.get('promotion');
    this.allOU = this.ouService.getAll();
  }

  ngOnInit() {
    const today = new Date();
    this.today = today.toISOString().slice(0, 10);
    today.setFullYear(today.getFullYear() + 100);
    this.futureToday = today.toISOString().slice(0, 10);

    const dateString = `${new Date().toISOString().slice(0, 10)}T00:00`;
    if(!this.promotion.startDate) { this.promotion.startDate = dateString; }
    if(!this.promotion.endDate)   { this.promotion.endDate = dateString; }
  }

  handleSearchResults(result: any) {
    // TODO custom search support instead of requiring a scanner (maybe make this into a popup)
    if(result.items.length !== 1) { return; }

    if(!this.promotion.promoItems) { this.promotion.promoItems = []; }

    const newPromoItem = new PromoItem(_.cloneDeep(result.items[0]));

    if(_.find(this.promotion.promoItems, { sku: newPromoItem.sku })) { return; }
    delete newPromoItem.id;
    this.promotion.promoItems.push(newPromoItem);

    setTimeout(() => {
      const transactionList = document.getElementById('promoitems-list');
      transactionList.scrollTop = transactionList.scrollHeight;
    });
  }

  changeDiscount() {
    // this.promotion.discountValue = 0;
  }

  changeGrouping() {
    if(this.promotion.discountGrouping === 'SKU') {
      delete this.promotion.organizationalunitId;
    } else {
      delete this.promotion.promoItems;
    }
  }

  dismiss(item?: Promotion) {
    this.viewCtrl.dismiss(item);
  }

  create() {
    if(this.promotion.temporary) {
      return this.dismiss(this.promotion);
    }

    this.prService
      .create(this.promotion)
      .subscribe(item => {
        this._formErrors.next({});
        this.dismiss(item);
      }, e => this._formErrors.next(e.formErrors));
  }

  update() {
    this.prService
      .update(this.promotion)
      .subscribe(() => {
        this._formErrors.next({});
        this.dismiss(this.promotion);
      }, e => this._formErrors.next(e.formErrors));
  }

}
