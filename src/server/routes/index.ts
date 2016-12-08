
import stockitem from './stockitem';
import organizationalunit from './organizationalunit';
import promotion from './promotion';

export default (app) => {
  stockitem(app);
  organizationalunit(app);
  promotion(app);
};
