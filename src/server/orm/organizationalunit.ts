
import { bookshelf } from '../server';

export const OrganizationalUnit = bookshelf.Model.extend({
  tableName: 'organizationalunit',
  hasTimestamps: true,
  softDelete: true
});
