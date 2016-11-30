
import * as _ from 'lodash';
import { Logger } from './logger';

const fs = require('fs');

Logger.info('Init', 'Starting server...');

const kill = () => process.exit();

try {
  fs.accessSync(`${__dirname}/server.config.json`, fs.F_OK);
} catch (e) {
  Logger.error('Init', 'Can\'t find the server.config.json file. Please place one in src/server (dev) or in the root (prod).');
  kill();
}

const config = require('./server.config.json');

if(_.isUndefined(config.db)) {
  Logger.error('Init', 'No `db` key in config file. Please add one with these keys: hostname, username, password, database');
  kill();
}

if(_.isUndefined(config.server)) {
  Logger.error('Init', 'No `server` key in config file. Please add one with these keys: port');
  kill();
}

if(_.isUndefined(config.db.hostname)
|| _.isUndefined(config.db.username)
|| _.isUndefined(config.db.password)
|| _.isUndefined(config.db.database)) {
  Logger.error('Init', '`db` object not complete. Please ensure these keys exist: hostname, username, password, database');
  kill();
}

if(_.isUndefined(config.server.port)) {
  Logger.error('Init', '`server` object not complete. Please ensure these keys exist: port');
  kill();
}

if(!config.db.hostname || !config.db.username || !config.db.database) {
  Logger.error('Init', '`db` object not complete. hostname, username, database are required');
  kill();
}

const db = require('knex')(require('./knexfile'));

export const bookshelf = require('bookshelf')(db);
bookshelf.plugin('pagination');
bookshelf.plugin(require('bookshelf-paranoia'));

export const start = () => {
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  require('./routes/index').default(app);

  const server = require('http').createServer(app);
  server.listen(config.server.port);
  Logger.info('Init', `REST API listening on port ${config.server.port}`);
};
