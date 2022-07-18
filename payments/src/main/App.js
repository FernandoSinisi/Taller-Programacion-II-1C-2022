const database = require('../data/database');
const constants = require('../others/constants');
const cors = require('cors');
const express = require('express');
const routes = require('./routes')
const bodyParser = require("body-parser");
const Logger = require("../services/Logger");
const swaggerUi = require("swagger-ui-express");
const {swaggerConfig} = require('./swaggerConfig');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerDoc = swaggerJsDoc(swaggerConfig);
const {runMigrations} = require("../data/migrations");

class App {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());
    }

    async syncDB() {
        if (!constants.isDevelopment) {
            await runMigrations();
        }

        // "sync()" creates the database table for our model(s),
        // if we make .sync({force: true}),
        // the db is dropped first if it is already existed
        await database.sync({
            force: constants.RESET_DATABASE
        });

        this.app.listen(constants.nodePort, () => {
            console.log(`Listening on port ${constants.nodePort}`);
        });
    }

    defineLogLevel() {
        Logger.setLevel(constants.LOG_LEVEL);
    }

    defineEvents() {
        this.app.use('/', routes);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    }
}

const main = new App();

main.syncDB()
    .then(() => {
        main.defineLogLevel();
        main.defineEvents();
    })
    .catch((error) => {
        console.log(error);
    });
