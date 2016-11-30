
import stockitem from './stockitem';
import organizationalunit from './organizationalunit';

export default (app) => {
  stockitem(app);
  organizationalunit(app);
};
