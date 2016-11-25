
import _ from 'lodash';

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: any, maxLength = 30): string {
    return _.truncate(value, { length: maxLength });
  }
}
