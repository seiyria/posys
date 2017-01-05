
import stockitem from './stockitem';
import organizationalunit from './organizationalunit';
import promotion from './promotion';
import invoice from './invoice';
import inventory from './inventory';
import location from './location';
import system from './system';
import report from './report';
import audit from './audit';

export default (app) => {
  stockitem(app);
  organizationalunit(app);
  promotion(app);
  invoice(app);
  inventory(app);
  location(app);
  system(app);
  report(app);
  audit(app);
};
