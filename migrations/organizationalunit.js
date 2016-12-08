
exports.up = (knex) => {
  return knex.schema
    .createTable('organizationalunit', (table) => {
      table.increments('id').primary();
      table.string('name', 50);
      table.string('description', 500);
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('organizationalunit');
};
