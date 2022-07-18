const database = require('../data/database');
const constants = require('../others/constants');
const cors = require('cors');
const express = require('express');
const bodyParser = require("body-parser");
const Logger = require("../services/Logger");
const { runMigrations } = require("../data/migrations");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { swaggerConfig } = require('./swaggerConfig');

const ApiKeySercice = require('../services/ApiKeyService');

const swaggerDoc = swaggerJsDoc(swaggerConfig);

class App {
  constructor() {
    this.app = express();

    this.app
        .use( cors() );

    this.app
        .use( bodyParser.json() );

    this.app.use( '/api-docs',
                  swaggerUi.serve,
                  swaggerUi.setup(swaggerDoc) );

    this.ApiKeySercice = new ApiKeySercice();
  }

  async syncDB() {
    // "sync()" creates the database table(s) for our model(s),
    // if we make .sync({force: true}),
    // the db is dropped first if it is already existed
    await database.sync( {
        force: constants.RESET_DATABASE
    } );

    if (! constants.isDevelopment) {
          await runMigrations();
    }

    this.app
        .listen(constants.nodePort, () => {
            console.log(`Listening on port ${constants.nodePort}`);
    } );
  }

  defineLogLevel() {
      Logger.setLevel(constants.LOG_LEVEL);
  }

  defineEvents() {
    this.ApiKeySercice
        .defineEvents(this.app);
  }
}

const main = new App();

main.syncDB()
    .then( () => {
      main.defineLogLevel();
      main.defineEvents();
      } )
    .catch( (error) => {
      console.log(error);
    }) ;
