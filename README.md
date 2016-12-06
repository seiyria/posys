# Posys

A PoS System.

## Installation

* clone the repository
* install postgresql
* `npm install -g ionic`
* `npm install`
* create `src/server/server.config.json` (sample below)
* `npm run migrate:latest` (set up the database)
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

## Hardware Recommendations

* A barcode scanner (this application makes heavy use of an "omni search" input which allows for text entry even when not focused, to facilitate quick lookup of items - a barcode scanner is used in testing and makes the interface significantly easier to use)
