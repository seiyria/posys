
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Location } from '../../../models/location';

import { LocationService } from '../../../services/location.service';

@Component({
  templateUrl: 'location.management.html'
})
export class LocationManagerComponent implements OnInit {

  public location: Location = new Location();
  public allLocations: Location[] = [];
  public _formErrors: BehaviorSubject<any> = new BehaviorSubject({});
  public formErrors: Observable<any> = this._formErrors.asObservable();

  constructor(public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public locaService: LocationService) {}

  ngOnInit() {
    this.locaService.getAll().toPromise().then(data => {
      this.allLocations = data;
    });
  }

  addNewLocation() {
    this.locaService
      .create(this.location)
      .subscribe((newOU) => {
        this.allLocations.push(newOU);
        this.allLocations = _.sortBy(this.allLocations, 'name');
        this.resetLocation();
        this._formErrors.next({});
      }, e => this._formErrors.next(e.formErrors));
  }

  removeLocation(loca: Location) {

    const confirm = this.alertCtrl.create({
      title: `Remove Location "${loca.name}"?`,
      message: 'Exercise caution when doing this. You may receive errors.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.locaService
              .remove(loca)
              .subscribe(() => {
                this.allLocations = _.reject(this.allLocations, checkLoca => checkLoca.id === loca.id);
              });
          }
        }
      ]
    });
    confirm.present();
  }

  updateLocation(loca: Location) {
    this.locaService
      .update(loca)
      .subscribe(() => {
        _.extend(_.find(this.allLocations, { id: loca.id }), loca);
        this.resetLocation();
      });
  }

  resetLocation() {
    this.location = new Location();
  }

  editLocation(loca: Location) {
    this.location = new Location(loca);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
