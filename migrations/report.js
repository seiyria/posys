
exports.up = (knex) => {
  return knex.schema
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

      table.dateTime('deleted_at');
      table.timestamps();
    })
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('reportconfiguration');
};
