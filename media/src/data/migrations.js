const database = require('./database');
const Sequelize = require('sequelize');
const constants = require("../others/constants");
const {Song,
       Playlist,
       Album} = require("../data/Media");

const queryInterface = database.getQueryInterface();

async function runMigrations() {
    /* ================ EXAMPLES ===================== */
    /* await queryInterface.removeColumn('users',
                                  'isAdmin');
                       .catch(e => {
                        console.log(e);
                       } ); */
    /*
       await queryInterface.addColumn(Song.tableName,
           'isBlocked', {
                  type: Sequelize.BOOLEAN,
                  allowNull: false,
                  defaultValue: false
           }).catch(error => console.log(error.toString())); */


    /* await queryInterface.changeColumn('users ',
      'walletId', {
        type: Sequelize.INTEGER,
        unique: true
      },)
      .catch(error => {
        console.log(error.toString());
      });*/
}

module.exports = {
    runMigrations
}
