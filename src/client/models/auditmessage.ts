
import * as _ from 'lodash';

import { Location } from './location';

export class AuditMessage {
  id?: number;
  name: string;
  created_at: Date;
  module: string;
  message: string;
  locationId: number;
  terminalId: string;
  refObj: any;

  location: Location;

  constructor(initializer?: AuditMessage) {
    _.assign(this, initializer);
  }
}
