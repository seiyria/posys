
const TOTAL_DIGITS = 12;
const CENT_DIGITS = 2;

exports.up = (knex) => {
  return knex.schema
    .createTable('invoice', (table) => {
      table.increments('id').primary();
      table.dateTime('purchaseTime');
      table.string('purchaseMethod');
      table.decimal('purchasePrice', TOTAL_DIGITS, CENT_DIGITS);
      table.decimal('cashGiven', TOTAL_DIGITS, CENT_DIGITS);
      table.boolean('isVoided');
      table.timestamps();
    })
    .createTable('invoicepromo', (table) => {
      table.increments('id').primary();
      table.integer('promoId').unsigned().references('promo.id');
      table.jsonb('promoData');
      table.timestamps();
    })
    .createTable('invoiceitem', (table) => {
      table.increments('id').primary();
      table.integer('stockitemId').unsigned().references('stockitem.id');
      table.jsonb('stockitemData');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('invoice')
    .dropTable('invoicepromo')
    .dropTable('invoiceitem');
};
