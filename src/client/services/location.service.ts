
import { Location } from '../models/location';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './http.custom';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LocationService {

  private url = 'location';

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  getAll(): Observable<Location[]> {
    return this.http.get(this.settings.buildAPIURL(this.url))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  create(item: Location): Observable<Location> {
    return this.http.put(this.settings.buildAPIURL(this.url), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  update(item: Location): Observable<Location> {
    return this.http.patch(this.settings.buildAPIURL(this.url, item.id), item)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  remove(item: Location) {
    return this.http.delete(this.settings.buildAPIURL(this.url, item.id))
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }
}
