import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';

import { ReportService } from '../../services/report.service';
import { ApplicationSettingsService } from '../../services/settings.service';
import { OrganizationalUnitService } from '../../services/organizationalunit.service';

import { OrganizationalUnit } from '../../models/organizationalunit';
import { ReportConfiguration } from '../../models/reportconfiguration';

const Papa = require('papaparse');
const { saveAs } = require('file-saver');
const formatDate = require('date-fns/format');

const stockItemColumns = [
  { name: 'Name',             key: 'name' },
  { name: 'SKU',              key: 'sku' },
  { name: 'OU',               key: 'organizationalunit.name', allowGroup: true },
  { name: 'Taxable',          key: 'taxable' },
  { name: 'Cost',             key: 'cost' },
  { name: 'Quantity',         key: 'quantity' },
  { name: 'Last Sold',        key: 'lastSoldAt' },
  { name: 'Reorder Alert',    key: 'reorderThreshold' },
  { name: 'Reorder Up To',    key: 'reorderUpToAmount' },
  { name: 'Vendor Name',      key: 'vendors[0].name', allowGroup: true },
  { name: 'Vendor SKU',       key: 'vendors[0].stockId' },
  { name: 'Vendor Cost',      key: 'vendors[0].cost' }
];

const invoiceColumns = [
  { name: 'Purchase Method',  key: 'purchaseMethod' },
  { name: 'Purchase Time',    key: 'purchaseTime' },
  { name: 'Purchase Price',   key: 'purchasePrice' },
  { name: 'Tax Collected',    key: 'taxCollected' },
  { name: 'Cash Given',       key: 'cashGiven' },
  { name: 'Subtotal',         key: 'subtotal' },
  { name: '# Items',          key: 'stockitems.length' },
  { name: '# Promos',         key: 'promotions.length' }
];

@Component({
  selector: 'my-page-reporting',
  templateUrl: 'reporting.html'
})
export class ReportingPageComponent implements OnInit {

  ous: OrganizationalUnit[];
  currentReport: ReportConfiguration;
  runningReport: boolean;

  baseReports: ReportConfiguration[] = [
    { name: 'Inventory (Current)', reportRoute: 'base/inventory/current', columns: stockItemColumns,
      filters: { sortBy: true, groupBy: true, ouFilter: true }, sortBy: 'Name',
      options: [
        { name: 'Reverse Sort',         short: 'reverseSort' },
        { name: 'Include Out of Stock', short: 'includeOutOfStock' },
        { name: 'Show Totals',          short: 'showTotals' }
      ],
      columnChecked: ['Name', 'SKU', 'OU', 'Cost', 'Quantity' ] },
    { name: 'Inventory (Old)',     reportRoute: 'base/inventory/old',     columns: stockItemColumns,
      filters: { singleDateFilter: true, sortBy: true, groupBy: true, ouFilter: true }, sortBy: 'Name',
      dateText: 'Items Not Sold Since',
      startDate: `${new Date().toISOString().slice(0, 10)}T00:00`,
      options: [
        { name: 'Reverse Sort',         short: 'reverseSort' },
        { name: 'Include Unsold',       short: 'includeUnsold' },
        { name: 'Show Totals',          short: 'showTotals' }
      ],
      columnChecked: ['Name', 'SKU', 'OU', 'Cost', 'Quantity', 'Last Sold' ] },
    { name: 'Inventory (Reorder)', reportRoute: 'base/inventory/reorder', columns: stockItemColumns,
      filters: { sortBy: true }, sortBy: 'Name',
      columnChecked: ['Name', 'Quantity', 'Vendor Name', 'Vendor SKU', 'Vendor Cost'] },
    { name: 'Sales (Completed)',   reportRoute: 'base/sales/completed',   columns: invoiceColumns,
      filters: { multiDateFilter: true },
      columnChecked: ['Purchase Time', 'Purchase Method', 'Purchase Price', 'Tax Collected', 'Subtotal', '# Items'] },
    { name: 'Sales (Voided)',      reportRoute: 'base/sales/voided',      columns: invoiceColumns,
      filters: { multiDateFilter: true },
      columnChecked: ['Purchase Time', 'Purchase Method', '# Items']  },
    { name: 'Sales (Tax)',         reportRoute: 'base/sales/tax',         columns: invoiceColumns,
      filters: { multiDateFilter: true },
      columnChecked: ['Purchase Time', 'Tax Collected'] }
  ];

  constructor(public reportService: ReportService,
              private ouService: OrganizationalUnitService,
              private settings: ApplicationSettingsService) {}

  ngOnInit() {
    this.ouService
      .getAll()
      .toPromise()
      .then(ous => {
        this.ous = ous;
      });
  }

  groupBys() {
    return _.filter(this.currentReport.columns, 'allowGroup');
  }

  selectNewReport(reportConfig: ReportConfiguration) {
    this.currentReport = _.cloneDeep(reportConfig);
    _.each(this.currentReport.columnChecked, col => {
      _.find(this.currentReport.columns, { name: col }).checked = true;
    });
  }

  reorderColumns({ from, to }) {
    let element = this.currentReport.columns[from];
    this.currentReport.columns.splice(from, 1);
    this.currentReport.columns.splice(to, 0, element);
  }

  get formattedReportName() {
    const locaString = `${this.settings.safeBusinessName}-${this.settings.safeLocationName}-${this.settings.safeTerminalId}`;
    return `Report-${locaString}-${new Date()}`;
  }

  runReport() {

    this.runningReport = true;
    this.reportService
      .runReport(this.currentReport)
      .toPromise()
      .then(data => {
        this.runningReport = false;
        const transformedData = this.transformData(data);
        const reportWindow = window.open('', this.formattedReportName, 'height=500&width=500');
        reportWindow.document.write(this.reportAggregate(transformedData));

        const csvButton = reportWindow.document.getElementById('csv-button');

        csvButton.onclick = () => {
          const arrayData = _.reduce(transformedData, (prev, cur: any) => {
            prev.push(...cur.group);
            return prev;
          }, []);
          const csv = Papa.unparse(arrayData);
          const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
          saveAs(blob, `${this.formattedReportName}.csv`);
        };
      }, () => {
        this.runningReport = false;
      });
  }

  private transformData(data): any[] {
    let baseData = _.map(data, item => {
      return _.reduce(this.currentReport.columns, (prev, cur) => {
        if(!cur.checked) { return prev; }
        const value = _.get(item, cur.key, '');

        prev[cur.name] = value;

        if(_.isNull(value)) {
          prev[cur.name] = '';
        }

        if(cur.name === 'Last Sold') {
          if(!value) {
            prev[cur.name] = 'Never';
          } else {
            prev[cur.name] = formatDate(new Date(value), 'YYYY-MM-DD');
          }
        }

        return prev;
      }, {});
    });

    if(this.currentReport.sortBy) {
      baseData = _.sortBy(baseData, item => {
        const value = item[this.currentReport.sortBy];
        if(!_.isNaN(+value)) { return +value; }
        return (value || '').toLowerCase();
      });

      if(this.currentReport.optionValues.reverseSort) {
        baseData = baseData.reverse();
      }
    }

    let dataGroups: any = { All: baseData };

    if(this.currentReport.groupBy) {
      dataGroups = _.groupBy(baseData, this.currentReport.groupBy);
    }

    if(this.currentReport.optionValues.showTotals) {
      _.each(dataGroups, (group) => {
        const baseObj: any = { Name: 'Totals', doBold: true };

        baseObj.Quantity = (_.reduce(group, (prev, cur: any) => prev + cur.Quantity, 0)).toFixed(2);
        baseObj.Cost = (_.reduce(group, (prev, cur: any) => prev + ((cur.Cost || 0) * cur.Quantity), 0)).toFixed(2);
        baseObj['Vendor Cost'] = (_.reduce(group, (prev, cur: any) => prev + ((cur['Vendor Cost'] || 0) * cur.Quantity), 0)).toFixed(2);

        group.push(baseObj);
      });
    }

    return _.map(dataGroups, (group, name) => ({ name, group }));
  }

  private reportAggregate(data) {
    return `
<html>
  <head>
    <title>${this.formattedReportName}</title>
    <style>
      ${this.reportStyles()}
    </style>
    <body>
      <button class="print-hide" id="print-button" onclick="window.print()">print</button>
      <button class="print-hide" id="csv-button">csv</button>
      ${this.reportBody(data)}
    </body>
  </head>
</html>
`;
  }

  private reportBody(data) {

    const usefulColumns: string[] = (<string[]>_(this.currentReport.columns)
      .filter(col => col.checked)
      .map('name')
      .value());

    const content = `
<table>
  <caption class="main-title">${this.settings.businessName}</caption>
  <caption class="sub-title">${this.currentReport.name}</caption>
  <caption class="info-title">Run at ${this.settings.locationName} - ${this.settings.terminalId} on ${new Date()}</caption>
  <caption class="info-title">${this.reportRunPeriod()}</caption>
  <caption>&nbsp;</caption>
  
  ${_.map(data, ({ name, group }) => {
  return `
    <thead>
      <tr><th colspan="${usefulColumns.length}">Grouping: ${name}</th></tr>
      <tr>
        ${_.map(usefulColumns, col => {
          return `<th>${col}</th>`;
        }).join('')}
      </tr>
    </thead>
    <tbody>
      ${_.map(group, (item: any) => {
        return `
      <tr class="data-row ${item.doBold ? 'bold' : ''}">
        ${_.map(usefulColumns, col => { return `<td>${_.isUndefined(item[col]) ? '' : item[col]}</td>`; }).join('')}
      </tr>`;
      }).join('')}
      <tr class="table-separator"></tr>
    </tbody>`;
  }).join('')}
</table>
`;
    return content;
  }

  private reportRunPeriod(): string {
    if(!this.currentReport.startDate) { return ''; }
    if(this.currentReport.startDate && !this.currentReport.endDate) { return new Date(this.currentReport.startDate).toDateString(); }
    return `${new Date(this.currentReport.startDate).toDateString()} - ${new Date(this.currentReport.endDate).toDateString()}`;
  }

  private reportStyles() {
    return `
#print-button { position: absolute; top: 0;    right: 0; }
#csv-button   { position: absolute; top: 20px; right: 0; }

.main-title { font-size: 2rem; font-weight: bold; }
.sub-title  { font-size: 1.5rem; }
.info-title { font-style: italic; }

table { border-collapse: collapse; }
.data-row:nth-child(2n) { background-color: #ccc; }
.table-separator { height: 20px; }
td { padding-left: 10px; padding-right: 10px; margin-left: 5px; margin-right: 10px; margin-top: 50px; }

.print-show { display: none; }

.bold { font-weight: bold; }

@page {
  size: landscape;
}

@media print {
  .print-hide { display: none; }
  .print-show { display: block; }
}
`;
  }

}
