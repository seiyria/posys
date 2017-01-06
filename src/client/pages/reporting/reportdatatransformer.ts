
import * as _ from 'lodash';
const dateFunctions = require('date-fns');

export const reportRunPeriod = (report): string => {
  if(!report.startDate) { return ''; }
  if(report.startDate && !report.endDate) { return new Date(report.startDate).toDateString(); }
  return `${new Date(report.startDate).toDateString()} - ${new Date(report.endDate).toDateString()}`;
};

export const reportBody = (report, settings, data) => {

  const usefulColumns: any[] = _(report.columns)
    .filter(col => col.checked)
    // .map('name')
    .value();

  if(report.modifyColumns) {
    report.modifyColumns(usefulColumns);
  }

  const reportPeriod = reportRunPeriod(report);

  const content = `
<table>
  <caption class="main-title">${settings.businessName}</caption>
  <caption class="sub-title">${report.name}</caption>
  <caption class="info-title">Run on ${new Date()}</caption>
  ${reportPeriod ? `<caption class="info-title">Report Period: ${reportPeriod}</caption>` : ''}
  <caption>&nbsp;</caption>
  
  ${_.map(data, ({ name, group }) => {
    return `
    <thead>
      <tr><th colspan="${usefulColumns.length}">Grouping: ${name || 'Unknown'}</th></tr>
      <tr>
        ${_.map(usefulColumns, (col) => {
      return `<th>${col.name}</th>`;
    }).join('')}
      </tr>
    </thead>
    <tbody>
      ${_.map(group, (item: any) => {
      return `
      <tr class="data-row ${item.doBold ? 'bold' : ''}">
        ${_.map(usefulColumns, col => { 
          return `<td class="${col.isNumeric ? 'number-column' : ''}">
            ${_.isUndefined(item[col.name]) ? '' : item[col.name]}
          </td>`; }).join('')
        }
      </tr>`;
    }).join('')}
      <tr class="table-separator"></tr>
    </tbody>`;
  }).join('')}
</table>
`;
  return content;
};

export const reportStyles = () => {
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
td.number-column { text-align: right; }

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
};

export const reportAggregate = (report, reportName, settings, data) => {
  return `
<html>
  <head>
    <title>${reportName}</title>
    <style>
      ${reportStyles()}
    </style>
    <body>
      <button class="print-hide" id="print-button" onclick="window.print()">print</button>
      <button class="print-hide" id="csv-button">csv</button>
      ${reportBody(report, settings, data)}
    </body>
  </head>
</html>
`;
};

export const transformData = (report, settings, data): any[] => {
  const AGGREGATE_KEYS = [
    { key: 'Purchase Price',    decimals: 2 },
    { key: 'Tax Collected',     decimals: 2 },
    { key: 'Subtotal',          decimals: 2 },
    { key: 'Cash Given',        decimals: 2 },
    { key: '# Items',           decimals: 0 },
    { key: '# Promos',          decimals: 0 },
    { key: '# Uses',            decimals: 0 },
    { key: 'Quantity',          decimals: 0 },
    { key: 'Reorder Quantity',  decimals: 0 }
  ];

  let baseData = _.map(data, item => {
    return _.reduce(report.columns, (prev, cur: any) => {
      if(!cur.checked && !cur.always) { return prev; }
      const value = _.get(item, cur.key, '');

      prev[cur.name] = value;

      if(_.isNull(value)) {
        prev[cur.name] = '';
      }

      if(_.includes(['Purchase Time', 'Last Sold', 'Start Date', 'End Date'], cur.name)) {
        if(!value) {
          prev[cur.name] = 'Never';
        } else {
          prev[cur.name] = dateFunctions.format(new Date(value), 'YYYY-MM-DD hh:mm A');
        }
      }

      if(cur.name === 'Purchase Method') {
        prev[cur.name] = settings.invoiceMethodDisplay(value);
      }

      return prev;
    }, {});
  });

  if(report.sortBy) {
    baseData = _.sortBy(baseData, item => {
      const value = item[report.sortBy];
      if(!_.isNaN(+value)) { return +value; }
      return (value || '').toLowerCase();
    });

    if(report.optionValues.reverseSort) {
      baseData = baseData.reverse();
    }
  }

  if(report.modifyData) {
    _.each(baseData, item => {
      report.modifyData(item);
    });
  }

  let dataGroups: any = { All: baseData };

  if(report.groupBy) {
    dataGroups = _.groupBy(baseData, report.groupBy);
  }

  if(report.groupByDate) {
    const DATE_KEY = 'Purchase Time';
    const dateGroupBy = report.groupByDate;

    _.each(dataGroups, (group, key) => {

      dataGroups[key] = [];

      const groupedByDate = _.groupBy(group, purchase => dateFunctions[`startOf${report.groupByDate}`](purchase[DATE_KEY]));

      _.each(groupedByDate, (dateGroup: any[]) => {

        const startDateValue = dateFunctions[`startOf${dateGroupBy}`](dateGroup[0][DATE_KEY]);
        const endDateValue = dateFunctions[`endOf${dateGroupBy}`](dateGroup[0][DATE_KEY]);

        _.each([startDateValue, endDateValue], date => {
          dateFunctions.setSeconds(date, 0);
          dateFunctions.setMinutes(date, 0);
        });

        const startDateFormatted = dateFunctions.format(startDateValue, 'YYYY-MM-DD hh:mm A');
        const endDateFormatted = dateFunctions.format(endDateValue, 'YYYY-MM-DD hh:mm A');

        const baseObj = {
          'Purchase Time': `${startDateFormatted} - ${endDateFormatted}`,
          'Purchase Method': 'Unknown'
        };

        _.each(AGGREGATE_KEYS, aggKey => baseObj[aggKey.key] = 0);

        const aggregateObject = _.reduce(dateGroup, (prev, cur) => {
          _.each(AGGREGATE_KEYS, aggKey => prev[aggKey.key] += (+cur[aggKey.key] || 0));
          return prev;
        }, baseObj);

        _.each(AGGREGATE_KEYS, aggKey => aggregateObject[aggKey.key] = aggregateObject[aggKey.key].toFixed(aggKey.decimals));

        dataGroups[key].push(aggregateObject);
      });
    });
  }

  if(report.optionValues.showTotals) {
    _.each(dataGroups, (group) => {
      const baseObj: any = { Name: 'Totals', doBold: true, 'Purchase Time': 'Totals' };

      _.each(AGGREGATE_KEYS, ({ key, decimals }) => {
        baseObj[key] = (_.reduce(group, (prev, cur: any) => prev + (+cur[key] || 0), 0)).toFixed(decimals);
      });

      if(_.some(group, (item: any) => item.Quantity)) {
        baseObj.Cost = (_.reduce(group, (prev, cur: any) => prev + ((cur.Cost || 0) * +cur.Quantity), 0)).toFixed(2);
        baseObj['Vendor Cost'] = (_.reduce(group, (prev, cur: any) => {
          return prev + ((cur['Vendor Cost'] || 0) * (+cur['Reorder Quantity'] || +cur.Quantity));
        }, 0)).toFixed(2);

      }

      group.push(baseObj);
    });
  }

  return _.map(dataGroups, (group, name) => ({ name, group }));
};
