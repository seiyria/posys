
const locations = [
  { name: 'Home Base' }
];

const createLocation = (knex, ou) => {
  return knex.table('location')
    .returning('id')
    .insert(ou);
};


exports.seed = (knex) => {
  return knex('location')
    // .del()
    .then(() => {
      return Promise.all(locations.map(location => createLocation(knex, location)));
    });
};
