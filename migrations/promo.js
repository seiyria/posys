
exports.up = (knex) => {
  return knex.schema
    .createTable('promo', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.string('discountType'); // 'dollars' or 'percent'
      table.string('itemReductionType'); // 'bogn' (buy one get next) or 'all' (all items in transaction grouping receive this discount)
      table.integer('organizationalunitId').unsigned().references('organizationalunit.id');
      table.integer('discountValue');
      table.dateTime('startDate');
      table.dateTime('endDate');
      table.timestamps();
    })
    .createTable('promoitem', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.string('sku');
      table.integer('stockitemId').unsigned().references('stockitem.id');
      table.integer('promoId').unsigned().references('promo.id');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('promo')
    .dropTable('promoitem');
};
