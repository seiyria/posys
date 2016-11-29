
import _ from 'lodash';

export class Department {
  id: number;
  name: string;
  description: string;

  constructor(initializer?: Department) {
    _.assign(this, initializer);
  }
}
