const Logger = require("./Logger");
const Apikeys = require('../data/Apikeys');
const checkHostExists = require("./checkHostExists");
const {getHostFrom} = require("../others/utils");
const { SERVICES_HOST } = require("../others/constants");
const { Op } = require("sequelize");

const checkApiKeyUp = async (apikey,
                             destiny) => {
    const response = await Apikeys.findOne( {
                        where: {
                            [Op.and]:
                                [{apiKey: apikey},
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

    if (response.dataValues === null) {
        return false;
    }

    if (destiny === undefined) {
        return true;
    }

    const destinyHost = getHostFrom(destiny);

    if ( destinyHost !== getHostFrom(SERVICES_HOST) ) {
        return await checkHostExists(destinyHost);
    }

    return true;
}

module.exports = checkApiKeyUp;
