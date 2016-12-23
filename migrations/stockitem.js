
const TOTAL_DIGITS = 12;
const CENT_DIGITS = 2;

exports.up = (knex) => {
  return knex.schema
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
      table.timestamps();
    })
    .createTable('stockitemvendor', (table) => {
      table.increments('id').primary();
      table.integer('stockitemId').unsigned().references('stockitem.id');
      table.string('name', 50);
      table.string('stockId', 50);
      table.decimal('cost', TOTAL_DIGITS, CENT_DIGITS);
      table.boolean('isPreferred');
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('stockitem')
    .dropTable('stockitemvendor');
};
