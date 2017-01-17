
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
    .count()
    .then(countArray => {
      const count = countArray[0].count;
      if(count > 0) {
        console.log('[Seed] Skipping location, count(*) > 0.');
        return;
      }
      return knex('location')
      // .del()
        .then(() => {
          return Promise.all(locations.map(location => createLocation(knex, location)));
        });
    });
};
