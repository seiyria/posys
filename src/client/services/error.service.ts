
import * as _ from 'lodash';

import { PagedItems } from '../models/pageditems';
import { ErrorMessage } from '../models/errormessage';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './override/http.custom';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ErrorService {

  private url = 'errormessage';

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  getMany(args: any): Observable<PagedItems<ErrorMessage>> {
    return this.http.get(this.settings.buildAPIURL(this.url), { search: this.settings.buildSearchParams(args) })
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  addClientError(item: ErrorMessage): Observable<ErrorMessage> {
    return this.http.put(this.settings.buildAPIURL(this.url), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

}
