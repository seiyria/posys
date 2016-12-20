
import * as _ from 'lodash';

import { LoggerService } from './logger.service';

import { Injectable } from '@angular/core';
import { URLSearchParams, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

const CONNECTION_URL = 'http://localhost:8080';

export class Settings {
  application: any;
  db: any;
  server: any;

  constructor(initializer) {
    _.merge(this, initializer);
    if(!this.application) { this.application = {}; }
    if(!this.db)          { this.db = {}; }
    if(!this.server)      { this.server = {}; }
  }

  get isValid(): boolean {
    const { application, db } = this;

    return !_.isUndefined(application.currencyCode) && application.currencyCode.length > 0
        && application.taxRate >= 0

        && !_.isUndefined(db.hostname) && db.hostname.length > 0
        && !_.isUndefined(db.username) && db.username.length > 0
        && !_.isUndefined(db.password)
        && !_.isUndefined(db.database) && db.database.length > 0;
  }
}

@Injectable()
export class ApplicationSettingsService {

  public settings: Settings = new Settings({});

  private url = 'system';

  constructor(private http: Http,
              private logger: LoggerService) {
    this.getAllSettings();
  }

  get currencyCode(): string {
    return this.settings.application.currencyCode;
  }

  get taxRate(): number {
    return this.settings.application.taxRate;
  }

  get connectionUrl(): string {
    let str = CONNECTION_URL;
    if(_.endsWith(str, '/')) {
      str = _.trimEnd(str, '/');
    }
    return str;
  }

  isValidConfiguration(): boolean {
    return this.settings.isValid;
  }

  getAllSettings(): void {
    this.http.get(this.buildAPIURL(this.url))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e))
      .toPromise()
      .then(data => {
        _.merge(this.settings, data);
      });
  }

  changeSettings(settings: Settings): Promise<Settings> {
    return this.http.patch(this.buildAPIURL(this.url), settings)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e))
      .toPromise()
      .then(data => {
        _.merge(this.settings, data);
        return this.settings;
      });
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
