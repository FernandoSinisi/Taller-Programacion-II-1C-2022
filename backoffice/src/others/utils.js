import constants from "./constants";

import sjcl from 'sjcl';

function getSHAOf(toHash) {
    const myBitArray = sjcl.hash.sha256.hash(toHash)
    return sjcl.codec.hex.fromBits(myBitArray);
}

const postToGateway = (body) => {
    body.verbRedirect = "POST";
    body.apiKey = constants.MY_API_KEY;

    return fetch(constants.SERVICES_HOST + constants.REDIRECT_URL, {
            method: "POST",
            headers: constants.JSON_HEADER,
            body: JSON.stringify(body)
        }
    ).then(response =>
        response.json()
    ).catch(error => {
        return {
            error: error.toString()
        };
    } );
}

const getToGateway = (destiny,
                      redirectParams) => {
    const body = {}
    body.redirectParams = redirectParams
    body.verbRedirect = "GET";
    body.redirectTo = destiny;
    body.apiKey = constants.MY_API_KEY;

    return fetch(constants.SERVICES_HOST + constants.REDIRECT_URL, {
            method: "POST",
            headers: constants.JSON_HEADER,
            body: JSON.stringify(body)
        }
    ).then(response =>
        response.json()
    ).catch(error => {
        return {
            error: error.toString()
        };
    } );
}

function getFormatedDate(dateNow) {
    return dateNow.getDate() + "/"
        + parseInt(dateNow.getMonth() + 1)
        + "/"
        + dateNow.getFullYear();
}

function getUTCMinus3Time(aDate) {
    return (aDate.getHours()) + ":" +
           aDate.getMinutes() + ":" +
           aDate.getSeconds();
}

function getUTCMinus3TimeStamp(date) {
    return getFormatedDate(date) + " "
                                 + getUTCMinus3Time(date);
}

function areAnyUndefined(list) {
    return list.filter( (element) => {
        return element === undefined
            || element.length === 0
    } ).length > 0;
}

export {
  getSHAOf, areAnyUndefined, postToGateway, getFormatedDate,
  getToGateway, getUTCMinus3Time, getUTCMinus3TimeStamp
}