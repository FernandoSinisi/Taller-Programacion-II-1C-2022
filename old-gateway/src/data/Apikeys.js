const database = require("./database");
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const Apikeys = database.define("api_keys", {
    name: {
        type: Sequelize.STRING(1000),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    apiKey: {
        type: Sequelize.STRING(constants.SHA_LEN),
        allowNull: false,
        validate: {
            notEmpty: true
        },
        unique: true
    },

    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    creationDate: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    description: {
        type: Sequelize.STRING(10000),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
} );

module.exports = Apikeys;
