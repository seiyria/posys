
exports.up = (knex) => {
  return knex.schema
    .createTable('location', (table) => {
      table.increments('id').primary();
      table.string('name', 50);
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('location');
};
