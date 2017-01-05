import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';

import { LocalStorage } from 'ng2-webstorage';

import { AuditMessage } from '../../../models/auditmessage';
import { Location } from '../../../models/location';

import { LocationService } from '../../../services/location.service';
import { AuditService } from '../../../services/audit.service';
import { Pagination } from 'ionic2-pagination';

@Component({
  selector: 'my-page-audit',
  templateUrl: 'audit.html'
})
export class AuditPageComponent implements OnInit {

  public currentAuditItems: AuditMessage[] = [];
  public paginationInfo: Pagination;

  @LocalStorage()
  public moduleFilter: string;

  @LocalStorage()
  public locationFilter: number;

  public locations: Location[] = [];
  public modules = ['Category', 'Inventory', 'Invoice', 'Location', 'Promotion', 'Report', 'StockItem', 'System'];

  constructor(public audService: AuditService, public locaService: LocationService) {}

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
    this.audService
      .getMany({ page: newPage, location: this.locationFilter, module: this.moduleFilter })
      .toPromise()
      .then(({ items, pagination }) => {
        this.currentAuditItems = items;
        this.paginationInfo = pagination;
      });
  }

}
