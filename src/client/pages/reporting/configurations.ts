
import { ReportConfiguration } from '../../models/reportconfiguration';

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
  { name: 'Purchase Time',    key: 'purchaseTime' },
  { name: 'Purchase Method',  key: 'purchaseMethod', allowGroup: true },
  { name: 'Purchase Price',   key: 'purchasePrice' },
  { name: 'Tax Collected',    key: 'taxCollected' },
  { name: 'Cash Given',       key: 'cashGiven' },
  { name: 'Subtotal',         key: 'subtotal' },
  { name: '# Items',          key: 'stockitems.length' },
  { name: '# Promos',         key: 'promotions.length' }
];

export const AllReportConfigurations: ReportConfiguration[] = [
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
    filters: { sortBy: true, groupBy: true, ouFilter: true }, sortBy: 'Name',
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Show Totals',          short: 'showTotals' }
    ],
    modifyColumns: (columns) => columns.push('Reorder Quantity'),
    modifyData:    (item) => item['Reorder Quantity'] = item['Reorder Up To'] - item.Quantity,
    columnChecked: ['Name', 'Quantity', 'Reorder Alert', 'Reorder Up To', 'Vendor Name', 'Vendor SKU', 'Vendor Cost'] },

  { name: 'Sales (Completed)',   reportRoute: 'base/sales/completed',   columns: invoiceColumns,
    filters: { multiDateFilter: true, sortBy: true, groupBy: true },
    datePeriod: 0, dateDenomination: 'Day',
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Use Custom Dates',     short: 'useCustomDatePicker' },
      { name: 'Show Totals',          short: 'showTotals', checked: true }
    ],
    columnChecked: ['Purchase Time', 'Purchase Method', 'Purchase Price', 'Tax Collected', 'Subtotal', '# Items'] },

  { name: 'Sales (Voided)',      reportRoute: 'base/sales/voided',      columns: invoiceColumns,
    filters: { multiDateFilter: true },
    datePeriod: 0, dateDenomination: 'Day',
    columnChecked: ['Purchase Time', 'Purchase Method', '# Items']  },

  { name: 'Sales (Tax)',         reportRoute: 'base/sales/tax',         columns: invoiceColumns,
    filters: { multiDateFilter: true },
    datePeriod: 0, dateDenomination: 'Day',
    columnChecked: ['Purchase Time', 'Tax Collected'] }
];
