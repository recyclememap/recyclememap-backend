# RecycleMeMap-backend

Backend service for the map of recycling points in Ashdod city.

## About:

Backend service uses `MongoDB` as the database to store recycling points

## Environment variables:

* `CLIENT_URL` - url of frontend service (http://127.0.0.1:3101 by default)
* `PORT` - port of backend service (3100 by default)
* `DB_CONNECTION_URI` - uri of MongoDB database (see https://mongoosejs.com/docs/connections.html)

## How to run:

* set up `.env` file
* `pnpm install` - install dependecies
* `pnpm start` - run the server (http://127.0.0.1:3100)