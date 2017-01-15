
const TOTAL_DIGITS = 12;
const CENT_DIGITS = 2;

exports.up = (knex) => {
  return knex.schema
    .createTable('location', (table) => {
      table.increments('id').primary();
      table.string('name', 50);
      table.timestamps();
    })
    .createTable('organizationalunit', (table) => {
      table.increments('id').primary();
      table.string('name', 50);
      table.string('description', 500);
      table.timestamps();
    })
    .createTable('errormessage', (table) => {
      table.increments('id').primary();
      table.integer('locationId').unsigned().references('location.id');
      table.string('terminalId');
      table.string('module');
      table.string('message', 500);
      table.string('foundAt'); // client or server
      table.string('stack', 5000);
      table.timestamps();
    })
    .createTable('auditmessage', (table) => {
      table.increments('id').primary();
      table.integer('locationId').unsigned().references('location.id');
      table.string('terminalId');
      table.string('module');
      table.string('message');
      table.jsonb('refObject');
      table.timestamps();
    })
    .createTable('reportconfiguration', (table) => {
      table.increments('id').primary();
      table.integer('basedOn').unsigned();

      table.string('name');

      table.dateTime('startDate');
      table.dateTime('endDate');
      table.integer('datePeriod');
      table.string('dateDenomination');

      table.jsonb('columnOrder');
      table.jsonb('columnChecked');
      table.jsonb('options');

      table.string('sortBy');
      table.string('groupBy');
      table.string('groupByDate');
      table.integer('ouFilter').unsigned().references('organizationalunit.id');
      table.integer('locationFilter').unsigned().references('location.id');

      table.dateTime('deleted_at');
      table.timestamps();
    })
    .createTable('stockitem', (table) => {
      table.increments('id').primary();
      table.string('sku', 50).unique();
      table.string('name', 50);
      table.string('description', 500);
      table.integer('organizationalunitId').unsigned().references('organizationalunit.id');
      table.boolean('taxable');
      table.decimal('cost', TOTAL_DIGITS, CENT_DIGITS);
      table.integer('quantity');
      table.integer('reorderThreshold');
      table.integer('reorderUpToAmount');
      table.dateTime('lastSoldAt');
      table.timestamps();
    })
    .createTable('stockitemvendor', (table) => {
      table.increments('id').primary();
      table.integer('stockitemId').unsigned().references('stockitem.id');
      table.string('name', 50);
      table.string('stockId', 50);
      table.decimal('cost', TOTAL_DIGITS, CENT_DIGITS);
      table.boolean('isPreferred');
    })
    .createTable('promo', (table) => {
      table.increments('id').primary();
      table.string('name', 50);
      table.string('description', 500);
      table.string('discountType', 10); // 'Dollar' or 'Percent'
      table.string('itemReductionType', 15); // 'BuyXGetNext' (buy X get next) or 'All' (all items in transaction grouping receive this discount)
      table.string('discountGrouping', 10); // 'SKU' or 'OU'
      table.integer('organizationalunitId').unsigned().references('organizationalunit.id');
      table.integer('discountValue');
      table.integer('numItemsRequired').unsigned();
      table.dateTime('startDate');
      table.dateTime('endDate');
      table.timestamps();
    })
    .createTable('promoitem', (table) => {
      table.increments('id').primary();
      table.string('name', 50);
      table.string('description', 500);
      table.string('sku', 50);
      table.integer('stockitemId').unsigned().references('stockitem.id');
      table.integer('promoId').unsigned().references('promo.id');
      table.timestamps();
    })
    .createTable('invoice', (table) => {
      table.increments('id').primary();
      table.dateTime('purchaseTime');
      table.dateTime('deleted_at');
      table.integer('invoiceReferenceId').unsigned().references('invoice.id');
      table.string('locationId'); // doesnt work?: .unsigned().references('location.id');
      table.string('terminalId').notNullable();
      table.string('purchaseMethod');
      table.decimal('purchasePrice', TOTAL_DIGITS, CENT_DIGITS);
      table.decimal('taxCollected', TOTAL_DIGITS, CENT_DIGITS);
      table.decimal('subtotal', TOTAL_DIGITS, CENT_DIGITS);
      table.decimal('cashGiven', TOTAL_DIGITS, CENT_DIGITS);
      table.boolean('isVoided').defaultTo(false);
      table.boolean('isReturned').defaultTo(false);
      table.boolean('isOnHold').defaultTo(false);
      table.timestamps();
    })
    .createTable('invoicepromo', (table) => {
      table.increments('id').primary();
      table.integer('invoiceId').unsigned().references('invoice.id');
      table.integer('promoId').unsigned().references('promo.id');
      table.string('applyId');
      table.decimal('cost', TOTAL_DIGITS, CENT_DIGITS);
      table.jsonb('promoData');
      table.timestamps();
    })
    .createTable('invoiceitem', (table) => {
      table.increments('id').primary();
      table.integer('invoiceId').unsigned().references('invoice.id');
      table.integer('stockitemId').unsigned().references('stockitem.id');
      table.integer('quantity').unsigned();
      table.string('promoApplyId');
      table.decimal('cost', TOTAL_DIGITS, CENT_DIGITS);
      table.boolean('taxable');
      table.jsonb('stockitemData');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('location')
    .dropTable('organizationalunit')
    .dropTable('errormessage')
    .dropTable('auditmessage')
    .dropTable('reportconfiguration')
    .dropTable('stockitem')
    .dropTable('stockitemvendor')
    .dropTable('promo')
    .dropTable('promoitem')
    .dropTable('invoice')
    .dropTable('invoicepromo')
    .dropTable('invoiceitem');
};
