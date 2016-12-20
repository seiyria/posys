
import * as _ from 'lodash';
import { Logger } from './logger';

const fs = require('fs');
const appRoot = require('app-root-path');

Logger.info('Init', 'Starting server...');

const defaultConfig = {
  server: {
    port: 8080
  },
  db: {
    hostname: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'posys'
  }
};

try {
  fs.accessSync(`${appRoot}/server.config.json`, fs.F_OK);
} catch (e) {
  Logger.info('Init', 'Can\'t find the server.config.json file. Creating a default one...');
  fs.writeFileSync(`${appRoot}/server.config.json`, JSON.stringify(defaultConfig, null, 4));
}

const config = require(`${appRoot}/server.config.json`);

export const knex = require('knex')(require('./knexfile'));

export const bookshelf = require('bookshelf')(knex);

const validator = require('./validator').default;

bookshelf.plugin('pagination');
bookshelf.plugin(require('bookshelf-validate'), { validateOnSave: true, validator });
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
