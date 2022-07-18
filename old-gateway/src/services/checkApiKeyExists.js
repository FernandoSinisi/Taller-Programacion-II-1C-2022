const Logger = require("./Logger");
const Apikeys = require('../data/Apikeys');
const { Op } = require("sequelize");

const checkApiKeyExists = async (apiKey) => {
    const response = await Apikeys.findOne( {
        where: {
            [Op.and]:
                [{apiKey: apiKey},
                    {active: true}]
        }
    } ).catch(error => {
        return {
            error: error.toString()
        }
    } );

    if (response !== null && response.error !== undefined) {
        Logger.error("No se pudo consultar las api key existentes");
        Logger.error(response.error);
        return false;
    }

    return response !== null
        && response.dataValues !== null;
}

module.exports = checkApiKeyExists;
