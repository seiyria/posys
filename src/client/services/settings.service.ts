
import * as _ from 'lodash';

import { LoggerService } from './logger.service';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLSearchParams, Response } from '@angular/http';
import { LocalStorageService } from 'ng2-webstorage';
import { HttpClient } from './override/http.custom';

import { PurchaseMethod } from '../models/invoice';
import { Settings } from '../models/settings';

@Injectable()
export class ApplicationSettingsService {

  public settings: Settings = new Settings({});

  private url = 'system';

  constructor(private http: HttpClient,
              private localStorage: LocalStorageService,
              private logger: LoggerService) {
    this.getAllSettings();
  }

  private get CONNECTION_URL() {
    return `http://${window.location.hostname}:8080`;
  }

  private safeify(str: string): string {
    return str.split(' ').join('');
  }

  get hasCustomCurrency(): boolean {
    return this.settings.application.customBusinessCurrency;
  }

  get canPrint(): boolean {
    return this.settings.printer.name;
  }

  get terminalId(): string {
    return this.settings.application.terminalId;
  }

  get safeTerminalId(): string {
    return this.safeify(this.terminalId);
  }

  get locationName(): string {
    return this.settings.application.locationName;
  }

  get safeLocationName(): string {
    return this.locationName;
  }

  get businessName(): string {
    return this.settings.application.businessName;
  }

  get safeBusinessName(): string {
    return this.safeify(this.businessName);
  }

  get currencyCode(): string {
    return this.settings.application.currencyCode;
  }

  get taxRate(): number {
    return this.settings.application.taxRate;
  }

  get connectionUrl(): string {
    let str = this.CONNECTION_URL;
    if(_.endsWith(str, '/')) {
      str = _.trimEnd(str, '/');
    }
    return str;
  }

  invoiceMethodDisplay(type: PurchaseMethod|string) {
    if(type === 'Custom') {
      return this.settings.application.customBusinessCurrency;
    }

    return type;
  }

  toIonicDateString(date: Date): string {
    return `${date.toISOString().slice(0, 10)}T00:00`;
  }

  isValidConfiguration(): boolean {
    return this.settings.isValid;
  }

  mergeSettings(newSettings): void {
    _.merge(this.settings, newSettings);
    this.localStorage.store('locationName', this.settings.application.locationName);
    // this.localStorage.store('terminalId', this.settings.application.terminalId);
  }

  getAllSettings(): void {
    this.http.get(this.buildAPIURL(this.url))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e))
      .toPromise()
      .then(data => {
        this.mergeSettings(data);
      });
  }

  changeSettings(settings: Settings): Promise<Settings> {
    return this.http.patch(this.buildAPIURL(this.url), settings)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e))
      .toPromise()
      .then(data => {
        this.mergeSettings(data);
        return this.settings;
      });
  }

  getAllPrinters(): Observable<any[]> {
    return this.http.get(this.buildAPIURL(`${this.url}/printers`))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  buildAPIURL(fragment: string, id?: number): string {
    return `${this.connectionUrl}/${fragment}${id ? '/' + id : ''}`;
  }

  buildSearchParams(opts): URLSearchParams {
    const retVal = new URLSearchParams();
    _.each(opts, (v, k) => retVal.set(k, v));
    return retVal;
  }
}
