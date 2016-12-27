
import * as _ from 'lodash';

import { ReportConfiguration } from '../models/reportconfiguration';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './http.custom';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ReportService {

  private url = 'report';

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  runReport(item: ReportConfiguration): Observable<any> {

    item.optionValues = _.reduce(item.options, (prev, cur) => {
      prev[cur.short] = cur.checked;
      return prev;
    }, {});

    return this.http.post(this.settings.buildAPIURL(`${this.url}/${item.reportRoute}`), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }
}
