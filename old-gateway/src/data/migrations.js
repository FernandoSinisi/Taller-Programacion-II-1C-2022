const database = require('./database');
const Sequelize = require('sequelize');
const {getFormatedDate} = require("../others/utils");
const queryInterface = database.getQueryInterface();

async function runMigrations() {
    // ###### EJEMPLOS ######

    /* const dateNow = new Date();

     await queryInterface.bulkInsert('api_keys', [ {
            name: "backoffice",
            apiKey: "645d293cdffe45a8674aa17b58157181a1a3127c3db705d9021307b678e7856b",
            active: true,
            creationDate: getFormatedDate(dateNow),
            createdAt: dateNow,
            updatedAt: dateNow,
            description: "dev: localhost:4480 - prod:demo-backoffice-2.herokuapp.com"
        },

        {
            name: "demo-users",
            apiKey: "72b60f6945b9beccf2a92c7da5f5c1963f4ec68240a1814b4ec5273cac5e7a44",
            active: true,
            creationDate: getFormatedDate(dateNow),
            createdAt: dateNow,
            updatedAt: dateNow,
            description: "dev: localhost: 4481 - prod: demo-users-2.herokuapp.com"
        },
    ], {}); */

    /* await queryInterface.removeColumn('users',
                                      'isAdmin');
                           .catch(e => {
                            console.log(e);
                           } );*/

    /* await queryInterface.addColumn('users',
                                   'isAdmin', {
                                      type: Sequelize.BOOLEAN,
                                      allowNull: false,
                                      defaultValue: false
                                    } )
                        .catch(error => {
                          console.log( error.toString() );
                        } ); */
}

module.exports = {
    runMigrations
}
