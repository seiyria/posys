
exports.up = (knex) => {
  return knex.schema
    .createTable('errormessage', (table) => {
      table.increments('id').primary();
      table.string('message');
      table.string('stack', 5000);
      table.timestamps();
    })
    .createTable('auditmessage', (table) => {
      table.increments('id').primary();
      table.string('message');
      table.string('module');
      table.jsonb('object');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('errormessage')
    .dropTable('auditmessage');
};
