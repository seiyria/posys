# Posys [![Build Status](https://travis-ci.org/seiyria/posys.svg?branch=master)](https://travis-ci.org/seiyria/posys)

A Point of Sale system for the modern age.

## Installation

If installing on windows, you may need `--msvs_version=<your_vs_version>` to install the printer module correctly. It's really finnicky.

* clone the repository
* install postgresql
* `npm install -g ionic`
* `npm install`
* create `src/server/server.config.json` (sample below)
* `npm run migrate:latest` (set up the database)
* `npm run seed:run` (get some sample data in the db to work with)
* `npm start:server` (in one terminal)
* `npm start` (in another terminal)

### Sample `server.config.json`
```json
{
  "server": {
    "port": 8080
  },
  "db": {
    "hostname": "localhost",
    "username": "postgres",
    "password": "postgres",
    "database": "posys"
  }
}
```

Further setup is done at runtime.

## Building For Electron
You should just be able to run `npm run build:osx:dev` or `npm run build:win:dev`. There is a task for dist/asar but there are currently some issues with it.

## Screenshots
See a gallery on [imgur](http://imgur.com/a/LJ3Hl).

## Hardware Recommendations

* A barcode scanner (this application makes heavy use of an "omni search" input which allows for text entry even when not focused, to facilitate quick lookup of items - a barcode scanner is used in testing and makes the interface significantly easier to use)
* A receipt printer (STAR or Epson-compatible)
