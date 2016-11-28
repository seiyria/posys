
import { Injectable } from '@angular/core';

const defaultSettings = {
  currencyCode: 'USD',
  taxRate: 5.00
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
}
