
import stockitem from './stockitem';
import organizationalunit from './organizationalunit';
import promotion from './promotion';
import invoice from './invoice';

export default (app) => {
  stockitem(app);
  organizationalunit(app);
  promotion(app);
  invoice(app);
};
