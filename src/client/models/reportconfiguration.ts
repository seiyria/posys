
export type ReportRoute =
  'base/inventory/current'
| 'base/inventory/old'
| 'base/inventory/reorder'
| 'base/sales/completed'
| 'base/sales/voided'
| 'base/sales/tax';

export class ReportConfiguration {
  name: string;
  reportRoute: ReportRoute;
  hasDateFilter?: boolean;
  singleDateFilter?: boolean;

  startDate?: string;
  endDate?: string;
  datePeriod?: number;
  dateDenomination?: string;
  dateText?: string = 'Date Range';

  columnOrder?: string[];
  columnChecked?: string[];
  columns: any[];
  options?: any[];
  optionValues?: any;

  modifyColumns?: Function;
  modifyData?: Function;

  filters?: any;

  sortBy?: string;
  groupBy?: string;
  ouFilter?: number;
}
