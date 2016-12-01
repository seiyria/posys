
import { Injectable } from '@angular/core';

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
    // TODO ensure no trailing slash
    return this.settings.connectionUrl;
  }

  buildAPIURL(fragment: string, id?: number) {
    return `${this.settings.connectionUrl}/${fragment}${id ? '/' + id : ''}`;
  }
}
