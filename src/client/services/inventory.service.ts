
import { StockItem } from '../models/stockitem';

import { LoggerService } from './logger.service';
import { ApplicationSettingsService } from './settings.service';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './http.custom';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class InventoryService {

  private url = 'inventory';

  constructor(private http: HttpClient,
              private logger: LoggerService,
              private settings: ApplicationSettingsService) {}

  export(columns: string[]): Observable<StockItem[]> {
    return this.http.post(this.settings.buildAPIURL(`${this.url}/export`), { columns })
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }

  import(items: StockItem[]): Observable<any> {
    return this.http.post(this.settings.buildAPIURL(`${this.url}/import`), items)
      .map((res: Response) => this.logger.observableUnwrap(res.json()))
      .catch(e => this.logger.observableError(e));
  }
}
