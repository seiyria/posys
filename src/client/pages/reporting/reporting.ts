import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';

import { ReportService } from '../../services/report.service';
import { ApplicationSettingsService } from '../../services/settings.service';
import { OrganizationalUnitService } from '../../services/organizationalunit.service';

import { OrganizationalUnit } from '../../models/organizationalunit';
import { ReportConfiguration } from '../../models/reportconfiguration';

import { AllReportConfigurations } from './configurations';

const Papa = require('papaparse');
const { saveAs } = require('file-saver');
const dateFunctions = require('date-fns');

@Component({
  selector: 'my-page-reporting',
  templateUrl: 'reporting.html'
})
export class ReportingPageComponent implements OnInit {

  datePeriods = [{ name: 'Current', sub: 0 }, { name: 'Previous', sub: 1 }];
  dateDenominations = [
    { name: 'Day' },
    { name: 'Week' },
    { name: 'Month' },
    { name: 'Quarter' },
    { name: 'Year' }
  ];

  ous: OrganizationalUnit[];
  currentReport: ReportConfiguration;
  runningReport: boolean;

  baseReports: ReportConfiguration[] = AllReportConfigurations;

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

  updateDatesBasedOnPeriodAndDenomination() {
    const now = new Date();
    const modified = dateFunctions[`sub${this.currentReport.dateDenomination}s`](now, this.currentReport.datePeriod);

    const modifiedStart = dateFunctions[`startOf${this.currentReport.dateDenomination}`](modified);
    const modifiedEnd = dateFunctions[`endOf${this.currentReport.dateDenomination}`](modified);

    this.currentReport.startDate = this.settings.toIonicDateString(modifiedStart);
    this.currentReport.endDate = this.settings.toIonicDateString(modifiedEnd);
  }

  updateOptionValues() {
    this.currentReport.optionValues = _.reduce(this.currentReport.options, (prev, cur) => {
      prev[cur.short] = cur.checked;
      return prev;
    }, {});
  }

  groupBys() {
    return _.filter(this.currentReport.columns, 'allowGroup');
  }

  selectNewReport(reportConfig: ReportConfiguration) {
    this.currentReport = _.cloneDeep(reportConfig);
    _.each(this.currentReport.columnChecked, col => {
      _.find(this.currentReport.columns, { name: col }).checked = true;
    });

    this.updateOptionValues();

    if(!_.isUndefined(reportConfig.dateDenomination) && !_.isUndefined(reportConfig.datePeriod)) {
      this.updateDatesBasedOnPeriodAndDenomination();
    }
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
      .then(({ data }) => {
        this.runningReport = false;
        if(!data || !data.length) { return; }
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

        if(_.includes(['Purchase Time', 'Last Sold'], cur.name)) {
          if(!value) {
            prev[cur.name] = 'Never';
          } else {
            prev[cur.name] = dateFunctions.format(new Date(value), 'YYYY-MM-DD HH:MM A');
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

    if(this.currentReport.modifyData) {
      _.each(baseData, item => {
        this.currentReport.modifyData(item);
      });
    }

    let dataGroups: any = { All: baseData };

    if(this.currentReport.groupBy) {
      dataGroups = _.groupBy(baseData, this.currentReport.groupBy);
    }

    if(this.currentReport.optionValues.showTotals) {
      _.each(dataGroups, (group) => {
        const baseObj: any = { Name: 'Totals', doBold: true, 'Purchase Time': 'Totals' };

        if(_.some(group, (item: any) => item.Quantity)) {
          baseObj.Quantity = (_.reduce(group, (prev, cur: any) => prev + cur.Quantity, 0)).toFixed(2);
          baseObj.Cost = (_.reduce(group, (prev, cur: any) => prev + ((cur.Cost || 0) * cur.Quantity), 0)).toFixed(2);
          baseObj['Vendor Cost'] = (_.reduce(group, (prev, cur: any) => {
            return prev + ((cur['Vendor Cost'] || 0) * (cur['Reorder Quantity'] || cur.Quantity));
          }, 0)).toFixed(2);

        } else if(_.some(group, (item: any) => item['Purchase Time'])) {
          const keys = ['Purchase Price', 'Tax Collected', 'Subtotal', '# Items', '# Promos'];

          _.each(keys, key => {
            baseObj[key] = (_.reduce(group, (prev, cur: any) => prev + (+cur[key] || 0), 0)).toFixed(2);
          });
        }

        if(_.some(group, item => item['Reorder Quantity'])) {
          baseObj['Reorder Quantity'] = (_.reduce(group, (prev, cur: any) => prev + cur['Reorder Quantity'], 0)).toFixed(2);
        }

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

    if(this.currentReport.modifyColumns) {
      this.currentReport.modifyColumns(usefulColumns);
    }

    const content = `
<table>
  <caption class="main-title">${this.settings.businessName}</caption>
  <caption class="sub-title">${this.currentReport.name}</caption>
  <caption class="info-title">Run at ${this.settings.locationName} - ${this.settings.terminalId} on ${new Date()}</caption>
  <caption class="info-title">Report Period: ${this.reportRunPeriod()}</caption>
  <caption>&nbsp;</caption>
  
  ${_.map(data, ({ name, group }) => {
  return `
    <thead>
      <tr><th colspan="${usefulColumns.length}">Grouping: ${name || 'Unknown'}</th></tr>
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
td, th { padding-left: 10px; padding-right: 10px; margin-left: 5px; margin-right: 10px; margin-top: 50px; }

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
