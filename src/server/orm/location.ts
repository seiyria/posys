/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

export const Location = bookshelf.Model.extend({
  tableName: 'location',
  hasTimestamps: true,
  softDelete: false,
  validations: {
    name: [
      {
        method: 'isLength',
        args: { min: 1, max: 50 },
        error: 'Your Location name must be between 1 and 50 characters.'
      }
    ]
  }
});
