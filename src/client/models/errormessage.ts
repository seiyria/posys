
import * as _ from 'lodash';

import { Location } from './location';

type FoundAt = 'Client' | 'Server';

export class ErrorMessage {
  id?: number;
  foundAt: FoundAt;
  message: string;
  stack: string;
  created_at?: Date;

  locationId?: number;
  terminalId?: string;

  location?: Location;

  constructor(initializer?: ErrorMessage) {
    _.assign(this, initializer);
  }
}
