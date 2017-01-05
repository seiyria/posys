
import * as _ from 'lodash';

export class Location {
  id?: number;
  name: string;

  constructor(initializer?: Location) {
    _.assign(this, initializer);

    if(this.name) {
      this.name = this.name.trim();
    }
  }
}
