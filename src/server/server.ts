
import * as _ from 'lodash';
import { Logger } from './logger';

const fs = require('fs');
const appRoot = require('app-root-path');

import { readSettings, writeSettings } from './_settings';

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

const knexConfig = require('./knexfile');
export const knex = require('knex')(knexConfig);

export const bookshelf = require('bookshelf')(knex);

const validator = require('./validator').default;

bookshelf.plugin(require('./ext/bookshelf-pagination'));
bookshelf.plugin(require('bookshelf-validate'), { validateOnSave: true, validator });
bookshelf.plugin(require('bookshelf-paranoia'));

export const setup = () => {
  knex.migrate.latest(knexConfig)
    .then(() => {
      Logger.info('Init', 'At latest migration.');
      readSettings(data => {
        if(data.initialSetup) { return; }
        knex.seed.run(knexConfig)
          .then(() => {
            Logger.info('Init', 'Seed data added.');
            data.initialSetup = true;
            writeSettings(data);
          });
      });
    });
};

export const start = () => {
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const app = express();
  app.use(bodyParser.json());

  const corsOptions = {
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['X-Location', 'X-Terminal', 'Content-Type'],
    exposedHeaders: ['X-Location', 'X-Terminal', 'Content-Type']
  };

  app.use(cors(corsOptions));

  require('./routes/index').default(app);

  const server = require('http').createServer(app);
  server.listen(config.server.port);
  Logger.info('Init', `REST API listening on port ${config.server.port}`);
};
