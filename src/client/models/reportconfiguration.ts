
export type ReportRoute =
  'base/inventory/current'
| 'base/inventory/old'
| 'base/inventory/reorder'
| 'base/promotions/all'
| 'base/promotions/pos'
| 'base/sales/completed'
| 'base/sales/voided';

export class LimitedReportConfiguration {
  id?: number;
  name: string;
  basedOn?: number;

  startDate?: string;
  endDate?: string;
  datePeriod?: number;
  dateDenomination?: string;

  columnOrder?: string[];
  columnChecked?: string[];

  options?: any[];

  sortBy?: string;
  groupBy?: string;
  groupByDate?: string;

  ouFilter?: number;
  locationFilter?: number;

  constructor(initializer: LimitedReportConfiguration) {
    this.id = initializer.id;
    this.name = initializer.name;
    this.basedOn = initializer.basedOn;
    this.startDate = initializer.startDate;
    this.endDate = initializer.endDate;
    this.datePeriod = initializer.datePeriod;
    this.dateDenomination = initializer.dateDenomination;
    this.columnOrder = initializer.columnOrder;
    this.columnChecked = initializer.columnChecked;
    this.options = initializer.options;
    this.sortBy = initializer.sortBy;
    this.groupBy = initializer.groupBy;
    this.groupByDate = initializer.groupByDate;
    this.ouFilter = initializer.ouFilter;
    this.locationFilter = initializer.locationFilter;
  }
}

export class ReportConfiguration extends LimitedReportConfiguration {
  internalId?: number;
  reportRoute: ReportRoute;

  dateText?: string = 'Date Range';

  columns: any[];
  optionValues?: any;

  modifyColumns?: Function;
  modifyData?: Function;

  filters?: any;
}
