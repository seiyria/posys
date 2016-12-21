/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

export const AuditMessage = bookshelf.Model.extend({
  tableName: 'auditmessage',
  hasTimestamps: true,
  softDelete: false,
  validations: {
  }
});
