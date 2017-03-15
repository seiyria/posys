/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';
import { Location } from './location';

export const AuditMessage = bookshelf.Model.extend({
  tableName: 'auditmessage',
  hasTimestamps: true,
  softDelete: false,
  location: function() {
    return this.belongsTo(Location, 'locationId');
  },
  validations: {
  }
});
