import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';

import { LocalStorage } from 'ng2-webstorage';

import { ErrorMessage } from '../../../models/errormessage';
import { Location } from '../../../models/location';

import { LocationService } from '../../../services/location.service';
import { ErrorService } from '../../../services/error.service';
import { Pagination } from 'ionic2-pagination';

@Component({
  selector: 'my-page-error',
  templateUrl: 'error.html'
})
export class ErrorPageComponent implements OnInit {

  public currentAuditItems: ErrorMessage[] = [];
  public paginationInfo: Pagination;

  @LocalStorage()
  public moduleFilter: string;

  @LocalStorage()
  public locationFilter: number;

  public locations: Location[] = [];
  public modules = ['Category', 'Inventory', 'Invoice', 'Location', 'Promotion', 'Report', 'StockItem', 'System'];

  constructor(public errService: ErrorService, public locaService: LocationService) {}

  ngOnInit() {
    this.changePage(1);

    this.locaService
      .getAll()
      .toPromise()
      .then(locas => {
        this.locations = locas;
      });
  }

  filterData() {
    this.changePage(1);
  }

  changePage(newPage) {
    this.errService
      .getMany({ page: newPage, location: this.locationFilter, module: this.moduleFilter })
      .toPromise()
      .then(({ items, pagination }) => {
        this.currentAuditItems = items;
        this.paginationInfo = pagination;
      });
  }

}
