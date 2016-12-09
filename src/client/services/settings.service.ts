
import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

const defaultSettings = {
  currencyCode: 'USD',
  taxRate: 5.00,
  connectionUrl: 'http://localhost:8080'
};

@Injectable()
export class ApplicationSettingsService {

  private settings = defaultSettings;

  get currencyCode(): string {
    return this.settings.currencyCode;
  }

  get taxRate(): number {
    return this.settings.taxRate;
  }

  get connectionUrl(): string {
    return this.settings.connectionUrl;
  }

  buildAPIURL(fragment: string, id?: number): string {
    return `${this.settings.connectionUrl}/${fragment}${id ? '/' + id : ''}`;
  }

  buildSearchParams(opts): URLSearchParams {
    const retVal = new URLSearchParams();
    _.each(opts, (v, k) => retVal.set(k, v));
    return retVal;
  }
}
