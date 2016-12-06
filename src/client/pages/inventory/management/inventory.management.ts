import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { StockItem } from '../../../models/stockitem';
import { OrganizationalUnit } from '../../../models/organizationalunit';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { StockItemService } from '../../../services/stockitem.service';
import { OrganizationalUnitService } from '../../../services/organizationalunit.service';

@Component({
  templateUrl: 'inventory.management.html'
})
export class InventoryManagerComponent {
  public stockItem: StockItem;
  public allOU: Observable<OrganizationalUnit[]>;

  public _formErrors: BehaviorSubject<any> = new BehaviorSubject({});
  public formErrors: Observable<any> = this._formErrors.asObservable();

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public siService: StockItemService,
              public ouService: OrganizationalUnitService) {

    this.stockItem = params.get('stockItem');
    this.allOU = this.ouService.getAll();
  }

  dismiss(item?: StockItem) {
    this.viewCtrl.dismiss(item);
  }

  create() {
    if(this.stockItem.temporary) {
      return this.dismiss(this.stockItem);
    }

    this.siService
      .create(this.stockItem)
      .subscribe(item => {
        this._formErrors.next({});
        this.dismiss(item);
      }, e => this._formErrors.next(e.formErrors));
  }

  update() {
    this.siService
      .update(this.stockItem)
      .subscribe(() => {
        this._formErrors.next({});
        this.dismiss(this.stockItem);
      }, e => this._formErrors.next(e.formErrors));
  }

}
