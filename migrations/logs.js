
exports.up = (knex) => {
  return knex.schema
    .createTable('errormessage', (table) => {
      table.increments('id').primary();
      table.string('message');
      table.string('foundAt'); // client or server
      table.string('stack', 5000);
      table.timestamps();
    })
    .createTable('auditmessage', (table) => {
      table.increments('id').primary();
      table.integer('locationId').unsigned().references('location.id');
      table.string('terminalId');
      table.string('module');
      table.string('message');
      table.jsonb('refObject');
      table.timestamps();
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTable('errormessage')
    .dropTable('auditmessage');
};
