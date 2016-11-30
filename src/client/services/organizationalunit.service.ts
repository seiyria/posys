
import * as _ from 'lodash';

import { OrganizationalUnit } from '../models/organizationalunit';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class OrganizationalUnitService {

  private url = 'organizationalunit';

  constructor(private http: Http,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  getAll(): Observable<OrganizationalUnit[]> {
    return this.http.get(this.settings.buildAPIURL(this.url))
      .map((res: Response) => res.json())
      .catch(e => this.logger.observableError(e));
  }

  get(id: number) {

  }

  add(item: OrganizationalUnit) {

  }

  update(item: OrganizationalUnit) {

  }

  remove(item: OrganizationalUnit) {

  }
}
