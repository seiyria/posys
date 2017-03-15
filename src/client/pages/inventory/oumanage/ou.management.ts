
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { OrganizationalUnit } from '../../../models/organizationalunit';

import { OrganizationalUnitService } from '../../../services/organizationalunit.service';

@Component({
  templateUrl: 'ou.management.html'
})
export class OUManagerComponent implements OnInit {

  public ou: OrganizationalUnit = new OrganizationalUnit();
  public allOU: OrganizationalUnit[] = [];
  public _formErrors: BehaviorSubject<any> = new BehaviorSubject({});
  public formErrors: Observable<any> = this._formErrors.asObservable();

  constructor(public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public ouService: OrganizationalUnitService) {}

  ngOnInit() {
    this.ouService.getAll().toPromise().then(data => {
      this.allOU = data;
    });
  }

  addNewOU() {
    this.ouService
      .create(this.ou)
      .subscribe((newOU) => {
        this.allOU.push(newOU);
        this.allOU = _.sortBy(this.allOU, 'name');
        this.resetOU();
        this._formErrors.next({});
      }, e => this._formErrors.next(e.formErrors));
  }

  removeOU(ou: OrganizationalUnit) {

    const confirm = this.alertCtrl.create({
      title: `Remove Category "${ou.name}"?`,
      message: 'Exercise caution when doing this. You may receive errors if you still have items assigned to this category.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.ouService
              .remove(ou)
              .subscribe(() => {
                this.allOU = _.reject(this.allOU, checkOU => checkOU.id === ou.id);
              });
          }
        }
      ]
    });
    confirm.present();
  }

  updateOU(ou: OrganizationalUnit) {
    this.ouService
      .update(ou)
      .subscribe(() => {
        _.extend(_.find(this.allOU, { id: ou.id }), ou);
        this.resetOU();
      });
  }

  resetOU() {
    this.ou = new OrganizationalUnit();
  }

  editOU(ou: OrganizationalUnit) {
    this.ou = new OrganizationalUnit(ou);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
