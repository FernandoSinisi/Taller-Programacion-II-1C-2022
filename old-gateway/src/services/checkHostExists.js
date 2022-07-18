const Logger = require("./Logger");
const Apikeys = require('../data/Apikeys');
const { Op } = require("sequelize");

const checkHostExists = async (destinyHost) => {
    const response = await Apikeys.findOne( {
        where: {
            [Op.and]:
                [{description: destinyHost},
                 {active: true}]
        }
    } ).catch(error => {
        return {
            error: error.toString()
        }
    } );

    if (response === null || response.error !== undefined) {
        Logger.error("No se pudo consultar las api key existentes.");

        Logger.error(response !== null
            ? response.error
            : "");

        return false;
    }

    return response.dataValues !== null;
}

module.exports = checkHostExists;
