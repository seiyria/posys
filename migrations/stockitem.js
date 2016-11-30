
const TOTAL_DIGITS = 12;
const CENT_DIGITS = 2;

exports.up = (knex) => {
  return knex.schema
    .createTable('stockitem', (table) => {
      table.increments('id').primary();
      table.string('sku').unique();
      table.string('stockCode');
      table.string('name');
      table.string('description');
      table.integer('organizationalunitId').unsigned().references('organizationalunit.id');
      table.boolean('taxable');
      table.decimal('cost', TOTAL_DIGITS, CENT_DIGITS);
      table.decimal('vendorPurchasePrice', TOTAL_DIGITS, CENT_DIGITS);
      table.integer('quantity');
      table.integer('reorderThreshold');
      table.integer('reorderUpToAmount');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('stockitem');
};
