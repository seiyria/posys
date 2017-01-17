
const appRoot = require('app-root-path');
const config = require(`${appRoot}/server.config.json`);
const isElectron = process.execPath.toLowerCase().search('electron') !== -1;

const env = isElectron ? 'prod' : 'dev';

module.exports = {
  client: 'pg',
  connection: {
    host: config.db.hostname,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database
  },
  migrations: {
    directory: `${appRoot}/migrations`
  },
  seeds: {
    directory: `${appRoot}/seeds/${env}`
  }
};
