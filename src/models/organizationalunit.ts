
import * as _ from 'lodash';

export class OrganizationalUnit {
  id: number;
  name: string;
  description: string;

  constructor(initializer?: OrganizationalUnit) {
    _.assign(this, initializer);
  }
}
