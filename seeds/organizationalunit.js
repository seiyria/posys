
const ous = [
  { name: 'Unspecified', description: '' }
];

const createOU = (knex, ou) => {
  return knex.table('organizationalunit')
    .returning('id')
    .insert(ou);
};


exports.seed = (knex) => {
  return knex('organizationalunit')
    // .del()
    .then(() => {
      return Promise.all(ous.map(ou => createOU(knex, ou)));
    });
};
