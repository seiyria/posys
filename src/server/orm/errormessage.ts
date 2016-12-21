/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

export const ErrorMessage = bookshelf.Model.extend({
  tableName: 'errormessage',
  hasTimestamps: true,
  softDelete: false,
  validations: {
  }
});
