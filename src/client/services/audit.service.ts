
import * as _ from 'lodash';

import { PagedItems } from '../models/pageditems';
import { AuditMessage } from '../models/auditmessage';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './http.custom';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuditService {

  private url = 'auditmessage';

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  getMany(args: any): Observable<PagedItems<AuditMessage>> {
    return this.http.get(this.settings.buildAPIURL(this.url), { search: this.settings.buildSearchParams(args) })
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

}
