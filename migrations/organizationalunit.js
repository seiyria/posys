
exports.up = (knex) => {
  return knex.schema
    .createTable('organizationalunit', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.dateTime('deleted_at');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('organizationalunit');
};
