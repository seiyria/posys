/* tslint:disable:only-arrow-functions no-invalid-this */

import { bookshelf } from '../server';

export const ReportConfiguration = bookshelf.Model.extend({
  tableName: 'reportconfiguration',
  hasTimestamps: true,
  softDelete: true,
  validations: {
    name: [
      {
        method: 'isLength',
        args: { min: 1, max: 50 },
        error: 'Your report name must be between 1 and 50 characters.'
      }
    ]
  }
});
