
const items = [
  { name: 'Reli-on Prime BGMS',           sku: '605388022929', cost: 19.99, taxable: true,  organizationalunitId: 2,
    description: 'A blood-glucose monitoring system.' },
  { name: 'Reli-on Prime Test Strips',    sku: '681131130332', cost: 4.99,  taxable: true,  organizationalunitId: 2,
    description: 'Test strips for the Reli-on BGMS.'  },
  { name: 'BD Alcohol Swabs 100ct',       sku: '382903268955', cost: 1.99,  taxable: true,  organizationalunitId: 2,
    description: 'Alcoholic cleaning swabs.'  },
  { name: 'A1C Self-check System',        sku: 'X000ONY6KT',   cost: 41.99, taxable: true,  organizationalunitId: 2,
    description: 'A system to help you check your A1C value.'  },
  { name: '4mm Needles',                  sku: '301691855918', cost: 2.99,  taxable: true,  organizationalunitId: 2,
    description: 'Short needles.'  },
  { name: '6mm Needles',                  sku: '301691851972', cost: 2.99,  taxable: true,  organizationalunitId: 2,
    description: 'Medium-length needles.'  },
  { name: '8mm Needles',                  sku: '761059307242', cost: 2.99,  taxable: true,  organizationalunitId: 2,
    description: 'Long needles.'  },
  { name: 'OneTouch Lancets 100ct',       sku: '353885393102', cost: 1.99,  taxable: true,  organizationalunitId: 2,
    description: 'Lancet stabby things.'  },
  { name: 'Sugar Cubes',                  sku: 'SUGAR-CUBE',   cost: 2.00,  taxable: false, organizationalunitId: 3,
    description: 'Sweet.'  }
];

const createStockitem = (knex, item) => {
  return knex.table('stockitem')
    .returning('id')
    .insert(item);
};


exports.seed = (knex) => {
  return knex('stockitem')
    .count()
    .then(countArray => {
      const count = countArray[0].count;
      if(count > 0) {
        console.log('[Seed] Skipping stockitem, count(*) > 0.');
        return;
      }
      return knex('stockitem')
      // .del()
        .then(() => {
          return Promise.all(items.map(item => createStockitem(knex, item)));
        });
    });
};
