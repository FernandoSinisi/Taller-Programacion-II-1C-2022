const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const Wallet = database.define('wallet', {

    address: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: true
    },

    privateKey: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: true
    },

    balance: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: false
    }
});

module.exports = Wallet;