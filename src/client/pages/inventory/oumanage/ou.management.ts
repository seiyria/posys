import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { OrganizationalUnit } from '../../../models/organizationalunit';

import { OrganizationalUnitService } from '../../../services/organizationalunit.service';

@Component({
  templateUrl: 'ou.management.html'
})
export class OUManagerComponent implements OnInit {

  public ouName: string;
  public allOU: Observable<OrganizationalUnit[]>;
  public _formErrors: BehaviorSubject<any> = new BehaviorSubject({});
  public formErrors: Observable<any> = this._formErrors.asObservable();

  constructor(public viewCtrl: ViewController, public ouService: OrganizationalUnitService) {}

  ngOnInit() {
    this.allOU = this.ouService.getAll();
  }

  addNewOU() {
    this.ouService
      .add(new OrganizationalUnit({ name: this.ouName }))
      .subscribe(() => {
        this.allOU = this.ouService.getAll();
        this.ouName = '';
        this._formErrors.next({});
      }, e => this._formErrors.next(e.formErrors));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
