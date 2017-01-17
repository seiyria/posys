
const ous = [
  { name: 'Unspecified',       description: '' },
  { name: 'Diabetic Supplies', description: '' },
  { name: 'Food', description: '' }
];

const createOU = (knex, ou) => {
  return knex.table('organizationalunit')
    .returning('id')
    .insert(ou);
};


exports.seed = (knex) => {
  return knex('organizationalunit')
    .count()
    .then(countArray => {
      const count = countArray[0].count;
      if(count > 0) {
        console.log('[Seed] Skipping organizationalunit, count(*) > 0.');
        return;
      }
      return knex('organizationalunit')
      // .del()
        .then(() => {
          return Promise.all(ous.map(ou => createOU(knex, ou)));
        });
    });
};
