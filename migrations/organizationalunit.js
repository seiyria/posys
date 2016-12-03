
exports.up = (knex) => {
  return knex.schema
    .createTable('organizationalunit', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('organizationalunit');
};
