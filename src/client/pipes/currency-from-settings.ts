
import { PipeTransform, Pipe } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { ApplicationSettingsService } from '../services/settings.service';

@Pipe({
  name: 'currencyFromSettings'
})
export class CurrencyFromSettingsPipe implements PipeTransform {
  constructor(public currency: CurrencyPipe, public settings: ApplicationSettingsService) {}

  transform(value: any): string {
    return this.currency.transform(value, this.settings.currencyCode, true);
  }
}
