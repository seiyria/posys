/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { Location } from './location';

export const ErrorMessage = bookshelf.Model.extend({
  tableName: 'errormessage',
  hasTimestamps: true,
  softDelete: false,
  location: function() {
    return this.belongsTo(Location, 'locationId');
  },
  validations: {
  }
});
