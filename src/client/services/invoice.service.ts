
import { PagedItems } from '../models/pageditems';
import { Invoice } from '../models/invoice';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './http.custom';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class InvoiceService {

  private url = 'invoice';

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  getMany(args: any): Observable<PagedItems<Invoice>> {
    return this.http.get(this.settings.buildAPIURL(this.url), { search: this.settings.buildSearchParams(args) })
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  get(item: Invoice): Observable<Invoice> {
    return this.http.get(this.settings.buildAPIURL(this.url, item.id))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  create(item: Invoice): Observable<Invoice> {
    return this.http.put(this.settings.buildAPIURL(this.url), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  update(item: Invoice): Observable<Invoice> {
    return this.http.patch(this.settings.buildAPIURL(this.url, item.id), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  remove(item: Invoice): Observable<Invoice> {
    return this.http.delete(this.settings.buildAPIURL(this.url, item.id))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  toggleVoid(item: Invoice): Observable<Invoice> {
    return this.http.post(this.settings.buildAPIURL(`${this.url}/void`, item.id), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }
}
