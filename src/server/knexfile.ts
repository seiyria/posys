
const config = require('./../../server.config.json');

module.exports = {
  client: 'pg',
  connection: {
    host: config.db.hostname,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database
  },
  migrations: {
    directory: '../../migrations'
  },
  seeds: {
    directory: '../../seeds'
  }
};
