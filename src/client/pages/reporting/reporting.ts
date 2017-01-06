import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { ReportService } from '../../services/report.service';
import { ApplicationSettingsService } from '../../services/settings.service';
import { OrganizationalUnitService } from '../../services/organizationalunit.service';
import { LocationService } from '../../services/location.service';

import { OrganizationalUnit } from '../../models/organizationalunit';
import { Location } from '../../models/location';
import { LimitedReportConfiguration, ReportConfiguration } from '../../models/reportconfiguration';

import { AllReportConfigurations } from './configurations';

import { transformData, reportAggregate } from './reportdatatransformer';

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
    { name: 'Hour' },
    { name: 'Day' },
    { name: 'Week' },
    { name: 'Month' },
    { name: 'Quarter' },
    { name: 'Year' }
  ];

  ous: OrganizationalUnit[];
  locations: Location[];
  customReports: LimitedReportConfiguration[];
  currentReport: ReportConfiguration;
  runningReport: boolean;

  baseReports: ReportConfiguration[] = AllReportConfigurations;

  constructor(public reportService: ReportService,
              private alertCtrl: AlertController,
              private ouService: OrganizationalUnitService,
              private locaService: LocationService,
              private settings: ApplicationSettingsService) {}

  ngOnInit() {
    this.updateReportList();
    this.ouService
      .getAll()
      .toPromise()
      .then(ous => {
        this.ous = ous;
      });
    this.locaService
      .getAll()
      .toPromise()
      .then(locas => {
        this.locations = locas;
      });
  }

  updateReportList() {
    this.reportService
      .getAll()
      .toPromise()
      .then(data => {
        this.customReports = data;
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
      prev[cur.short] = !!cur.checked;
      return prev;
    }, {});
  }

  groupBys() {
    return _.filter(this.currentReport.columns, 'allowGroup');
  }

  removeReport() {
    const confirm = this.alertCtrl.create({
      title: 'Remove Custom Report?',
      message: `Removing this report is irreversible, so you will have to recreate it if you want it back.`,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.reportService
              .remove(this.currentReport)
              .toPromise()
              .then(() => {
                this.currentReport = null;
                this.updateReportList();
              });
          }
        }
      ]
    });
    confirm.present();
  }

  updateReport() {
    this.reportService
      .update(new LimitedReportConfiguration(this.currentReport))
      .toPromise()
      .then(() => {
        this.updateReportList();
      });
  }

  saveReport() {
    let alert = this.alertCtrl.create({
      title: 'New Report Name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'New Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: ({ name }) => {
            if(!name) { return; }
            name = _.truncate(name, { length: 50, omission: '' });
            const saveConfig = new LimitedReportConfiguration(this.currentReport);
            saveConfig.basedOn = this.currentReport.internalId;
            saveConfig.name = name;

            this.reportService
              .create(saveConfig)
              .toPromise()
              .then(() => {
                this.updateReportList();
              });
          }
        }
      ]
    });
    alert.present();
  }

  loadReport(reportConfig: ReportConfiguration) {
    const newReport = _.merge(
      _.cloneDeep(_.find(AllReportConfigurations, { internalId: reportConfig.basedOn })),
      _.cloneDeep(reportConfig)
    );

    delete newReport.internalId;

    this.selectNewReport(newReport);
  }

  selectNewReport(reportConfig: ReportConfiguration) {
    this.currentReport = _.cloneDeep(reportConfig);
    _.each(this.currentReport.columnChecked, col => {
      const checkCol =  _.find(this.currentReport.columns, { name: col });
      if(!checkCol) { return; }
      checkCol.checked = true;
    });

    if(this.currentReport.columnOrder && this.currentReport.columnOrder.length > 0) {
      this.currentReport.columns = _.sortBy(this.currentReport.columns, item => {
        const index = _.indexOf(this.currentReport.columnOrder, item.name);
        if(index === -1) { return this.currentReport.columnOrder.length; }
        return index;
      });
    }

    this.updateOptionValues();

    if(!_.isUndefined(this.currentReport.dateDenomination)
    && !_.isUndefined(this.currentReport.datePeriod)

        // redundancy here ensures that the key exists (ie, it's a report that uses time)
        // and that it's set to false explicitly
    && this.currentReport.optionValues.useCustomDatePicker === false) {
      this.updateDatesBasedOnPeriodAndDenomination();
    }
  }

  reorderColumns({ from, to }) {
    let element = this.currentReport.columns[from];
    this.currentReport.columns.splice(from, 1);
    this.currentReport.columns.splice(to, 0, element);

    this.currentReport.columnOrder = <string[]>_.map(this.currentReport.columns, 'name');
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
        const transformedData = transformData(this.currentReport, this.settings, data);
        const reportWindow = window.open('', this.formattedReportName, 'height=500&width=500');

        if(!reportWindow) {
          throw new Error('Report window could not be opened. Probably, something is blocking popups?');
        }

        reportWindow.document.write(reportAggregate(this.currentReport, this.formattedReportName, this.settings, transformedData));

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

}
