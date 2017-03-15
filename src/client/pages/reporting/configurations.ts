
import { ReportConfiguration } from '../../models/reportconfiguration';

const stockItemColumns = [
  { name: 'Name',             key: 'name' },
  { name: 'SKU',              key: 'sku' },
  { name: 'Category',         key: 'organizationalunit.name', allowGroup: true },
  { name: 'Taxable',          key: 'taxable' },
  { name: 'Cost',             key: 'cost', isNumeric: true, always: true },
  { name: 'Quantity',         key: 'quantity', isNumeric: true, always: true },
  { name: 'Last Sold',        key: 'lastSoldAt' },
  { name: 'Reorder Alert',    key: 'reorderThreshold', isNumeric: true },
  { name: 'Reorder Up To',    key: 'reorderUpToAmount', isNumeric: true },
  { name: 'Vendor Name',      key: 'vendors[0].name', allowGroup: true },
  { name: 'Vendor SKU',       key: 'vendors[0].stockId' },
  { name: 'Vendor Cost',      key: 'vendors[0].cost', isNumeric: true }
];

const invoiceColumns = [
  { name: 'Purchase Time',    key: 'purchaseTime' },
  { name: 'Purchase Method',  key: 'purchaseMethod', allowGroup: true },
  { name: 'Purchase Price',   key: 'purchasePrice', isNumeric: true },
  { name: 'Location',         key: 'location.name', allowGroup: true },
  { name: 'Terminal',         key: 'terminalId', allowGroup: true },
  { name: 'Tax Collected',    key: 'taxCollected', isNumeric: true },
  { name: 'Cash Given',       key: 'cashGiven', isNumeric: true },
  { name: 'Subtotal',         key: 'subtotal', isNumeric: true },
  { name: '# Items',          key: 'stockitems.length', isNumeric: true },
  { name: '# Promos',         key: 'promotions.length', isNumeric: true }
];

const promoColumns = [
  { name: 'Name',             key: 'name' },
  { name: 'Discount Value',   key: 'discountValue', isNumeric: true },
  { name: 'Discount Type',    key: 'discountType', allowGroup: true },
  { name: 'Promotion Type',   key: 'itemReductionType', allowGroup: true },
  { name: 'Discount Group',   key: 'discountGrouping', allowGroup: true },
  { name: 'Start Date',       key: 'startDate' },
  { name: 'End Date',         key: 'endDate' },
  { name: '# Items Required', key: 'numItemsRequired', isNumeric: true },
  { name: '# Uses',           key: 'invoicePromos.length', isNumeric: true }
];

export const AllReportConfigurations: ReportConfiguration[] = [
  { internalId: 1, name: 'Inventory (Current)', reportRoute: 'base/inventory/current', columns: stockItemColumns,
    filters: { sortBy: true, groupBy: true, ouFilter: true }, sortBy: 'Name',
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Include Out of Stock', short: 'includeOutOfStock' },
      { name: 'Show Totals',          short: 'showTotals' }
    ],
    columnChecked: ['Name', 'SKU', 'Category', 'Cost', 'Quantity' ] },

  { internalId: 2, name: 'Inventory (Old)',     reportRoute: 'base/inventory/old',     columns: stockItemColumns,
    filters: { singleDateFilter: true, sortBy: true, groupBy: true, ouFilter: true }, sortBy: 'Name',
    dateText: 'Items Not Sold Since',
    startDate: `${new Date().toISOString().slice(0, 10)}T00:00`,
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Include Unsold',       short: 'includeUnsold' },
      { name: 'Show Totals',          short: 'showTotals' }
    ],
    columnChecked: ['Name', 'SKU', 'Category', 'Cost', 'Quantity', 'Last Sold' ] },

  { internalId: 3, name: 'Inventory (Reorder)', reportRoute: 'base/inventory/reorder', columns: stockItemColumns,
    filters: { sortBy: true, groupBy: true, ouFilter: true }, sortBy: 'Name',
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Show Totals',          short: 'showTotals' }
    ],
    modifyColumns: (columns) => columns.push('Reorder Quantity'),
    modifyData:    (item) => item['Reorder Quantity'] = item['Reorder Up To'] - item.Quantity,
    columnChecked: ['Name', 'Quantity', 'Reorder Alert', 'Reorder Up To', 'Vendor Name', 'Vendor SKU', 'Vendor Cost'] },

  { internalId: 7, name: 'Promotions (PoS)',   reportRoute: 'base/promotions/pos',   columns: promoColumns,
    filters: { multiDateFilter: true, sortBy: true, groupBy: true },
    datePeriod: 0, dateDenomination: 'Day',
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Use Custom Dates',     short: 'useCustomDatePicker' },
      { name: 'Show Totals',          short: 'showTotals', checked: true }
    ],
    columnChecked: ['Name', 'Discount Value', 'Discount Type', 'Start Date'] },

  { internalId: 8, name: 'Promotions (Used)',  reportRoute: 'base/promotions/all',  columns: promoColumns,
    filters: { multiDateFilter: true, sortBy: true, groupBy: true },
    datePeriod: 0, dateDenomination: 'Day',
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Use Custom Dates',     short: 'useCustomDatePicker' },
      { name: 'Show Totals',          short: 'showTotals', checked: true }
    ],
    columnChecked: ['Name', '# Uses'] },

  { internalId: 4, name: 'Sales (Completed)',   reportRoute: 'base/sales/completed',   columns: invoiceColumns,
    filters: { multiDateFilter: true, sortBy: true, groupBy: true, groupByDate: true, locationFilter: true },
    datePeriod: 0, dateDenomination: 'Day',
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Use Custom Dates',     short: 'useCustomDatePicker' },
      { name: 'Show Totals',          short: 'showTotals', checked: true }
    ],
    columnChecked: ['Purchase Time', 'Purchase Method', 'Purchase Price', 'Tax Collected', 'Subtotal', '# Items'] },

  { internalId: 5, name: 'Sales (Voided)',      reportRoute: 'base/sales/voided',      columns: invoiceColumns,
    filters: { multiDateFilter: true, sortBy: true, groupBy: true, groupByDate: true, locationFilter: true },
    datePeriod: 0, dateDenomination: 'Day',
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Use Custom Dates',     short: 'useCustomDatePicker' },
      { name: 'Show Totals',          short: 'showTotals', checked: true }
    ],
    columnChecked: ['Purchase Time', 'Purchase Method', 'Purchase Price', '# Items']  },

  { internalId: 6, name: 'Sales (Tax)',         reportRoute: 'base/sales/completed',   columns: invoiceColumns,
    filters: { multiDateFilter: true, sortBy: true, groupBy: true, groupByDate: true, locationFilter: true },
    datePeriod: 0, dateDenomination: 'Day',
    options: [
      { name: 'Reverse Sort',         short: 'reverseSort' },
      { name: 'Use Custom Dates',     short: 'useCustomDatePicker' },
      { name: 'Show Totals',          short: 'showTotals', checked: true }
    ],
    columnChecked: ['Purchase Time', 'Tax Collected'] }
];
