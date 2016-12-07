
import * as _ from 'lodash';

import { PagedItems } from '../models/pageditems';
import { Promotion } from '../models/promotion';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PromotionService {

  private url = 'promotion';

  constructor(private http: Http,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  search(query: string): Observable<Promotion[]> {
    return this.http.get(this.settings.buildAPIURL(`${this.url}/search`), { search: this.settings.buildSearchParams({ query }) })
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  getMany(args: any): Observable<PagedItems<Promotion>> {
    return this.http.get(this.settings.buildAPIURL(this.url), { search: this.settings.buildSearchParams(args) })
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  get(item: Promotion): Observable<Promotion> {
    return this.http.get(this.settings.buildAPIURL(this.url, item.id))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  create(item: Promotion): Observable<Promotion> {
    return this.http.put(this.settings.buildAPIURL(this.url), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  update(item: Promotion): Observable<Promotion> {
    return this.http.patch(this.settings.buildAPIURL(this.url, item.id), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  remove(item: Promotion): Observable<Promotion> {
    return this.http.delete(this.settings.buildAPIURL(this.url, item.id))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }
}
