
import * as _ from 'lodash';

import { PagedItems } from '../models/pageditems';
import { StockItem } from '../models/stockitem';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './override/http.custom';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class StockItemService {

  private url = 'stockitem';

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  search(query: string): Observable<StockItem[]> {
    return this.http.get(this.settings.buildAPIURL(`${this.url}/search`), { search: this.settings.buildSearchParams({ query }) })
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  getMany(args: any): Observable<PagedItems<StockItem>> {
    return this.http.get(this.settings.buildAPIURL(this.url), { search: this.settings.buildSearchParams(args) })
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  get(item: StockItem): Observable<StockItem> {
    return this.http.get(this.settings.buildAPIURL(this.url, item.id))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  create(item: StockItem): Observable<StockItem> {
    return this.http.put(this.settings.buildAPIURL(this.url), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  update(item: StockItem): Observable<StockItem> {
    return this.http.patch(this.settings.buildAPIURL(this.url, item.id), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  remove(item: StockItem): Observable<StockItem> {
    return this.http.delete(this.settings.buildAPIURL(this.url, item.id))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  private transformItemsToHash(items: StockItem[]): any {
    return _.reduce(items, (prev: any, cur: StockItem) => {
      prev[cur.sku] = prev[cur.sku] || 0;
      prev[cur.sku] += cur.quantity;
      return prev;
    }, {});
  }

  importMany(items: StockItem[]): Observable<any> {
    return this.http.post(this.settings.buildAPIURL(`${this.url}/import`), this.transformItemsToHash(items))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  exportMany(items: StockItem[]): Observable<any> {
    return this.http.post(this.settings.buildAPIURL(`${this.url}/import`), this.transformItemsToHash(items))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }
}
