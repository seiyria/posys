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
