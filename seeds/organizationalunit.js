
const ous = [
  { name: 'Unspecified', description: '' }
];

const createOU = (knex, ou) => {
  return knex.table('organizationalUnit')
    .returning('id')
    .insert(ou);
};


exports.seed = (knex) => {
  return knex('organizationalUnit')
    .del()
    .then(() => {
      return Promise.all(ous.map(ou => createOU(knex, ou)));
    });
};
