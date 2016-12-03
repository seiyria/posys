
import { bookshelf } from '../server';

export const OrganizationalUnit = bookshelf.Model.extend({
  tableName: 'organizationalunit',
  hasTimestamps: true,
  softDelete: false,
  validations: {
    name: [
      {
        method: 'isLength',
        args: { min: 1, max: 40 },
        error: 'Your OU name must be between 1 and 40 characters.'
      }
    ]
  }
});
