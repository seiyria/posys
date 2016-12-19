
exports.up = (knex) => {
  return knex.schema
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
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('promo')
    .dropTable('promoitem');
};
