const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const Deposit = database.define('deposit', {
    id: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: true,
        primaryKey:true
    },

    senderAddress: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: false
    },

    amountSent: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: false
    }

});

module.exports = Deposit;