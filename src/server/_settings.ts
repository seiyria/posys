
const fs = require('fs');
const appRoot = require('app-root-path');

export default {
  pagination: {
    pageSize: 50
  },
  search: {
    pageSize: 50
  }
};

export const readSettings = (callback) => {
  fs.readFile(`${appRoot}/server.config.json`, 'utf8', (err, data) => {
    if(err) { throw err; }
    callback(JSON.parse(data));
  });
};

export const writeSettings = (data, callback?) => {
  fs.writeFile(`${appRoot}/server.config.json`, JSON.stringify(data, null, 4), (err) => {
    if(err) { throw err; }
    if(callback) {
      callback();
    }
  });
};
