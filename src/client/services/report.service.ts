
import * as _ from 'lodash';

import { LimitedReportConfiguration, ReportConfiguration } from '../models/reportconfiguration';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './override/http.custom';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ReportService {

  private url = 'report';

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  runReport(item: ReportConfiguration): Observable<any> {
    return this.http.post(this.settings.buildAPIURL(`${this.url}/${item.reportRoute}`), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  getAll(): Observable<LimitedReportConfiguration[]> {
    return this.http.get(this.settings.buildAPIURL(this.url))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  create(item: LimitedReportConfiguration): Observable<LimitedReportConfiguration> {
    return this.http.put(this.settings.buildAPIURL(this.url), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  update(item: LimitedReportConfiguration): Observable<LimitedReportConfiguration> {
    return this.http.patch(this.settings.buildAPIURL(this.url, item.id), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  remove(item: LimitedReportConfiguration): Observable<LimitedReportConfiguration> {
    return this.http.delete(this.settings.buildAPIURL(this.url, item.id))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }
}
