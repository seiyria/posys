
import stockitem from './stockitem';
import organizationalunit from './organizationalunit';
import promotion from './promotion';
import invoice from './invoice';
import inventory from './inventory';
import system from './system';

export default (app) => {
  stockitem(app);
  organizationalunit(app);
  promotion(app);
  invoice(app);
  inventory(app);
  system(app);
};
