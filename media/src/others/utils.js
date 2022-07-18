const {MSG_NO_AUTORIZADO} = require("./constants");

const constants = require('../others/constants');
const fetch = require('node-fetch');

function setBodyResponse(responseBody, status, res) {
  res.status(status).json(responseBody);
}

function setErrorResponse(error, status, res) {
  const responseBody = {
    error: error.toString()
  }

  setBodyResponse(responseBody, status, res);
}

const newError = (status, message) => {
  return {status: status, body: {error: message}};
}

function getDate() {
  return getFormatedDate( new Date() );
}

const getFormatedDate = (timestamp) => {
  return timestamp.toISOString()
                  .substr(0, 10);
}

function getDateFromCreatedAtAttribute(timestamp) {
    const dateParts = getFormatedDate(timestamp).split(" ")[0]
                                                .split("-");

    // dd/MM/AAAA
    return dateParts[2] + "/"
                        + dateParts[1]
                        + "/"
                        + dateParts[0];
}

function areAnyUndefined(list) {
  return list.filter((element) => {
    return element === undefined || element.length === 0
  }).length > 0;
}

const postToGateway = (body) => {
  body.apiKey = constants.MY_API_KEY;

  return fetch(constants.SERVICES_HOST + constants.CHECK_URL, {
        method: "POST",
        headers: constants.JSON_HEADER,
        body: JSON.stringify(body)
      }
  ).then(async r => {
    const gatewayResponse = await r.json();

    if (gatewayResponse.error !== undefined) {
      return gatewayResponse;
    }

    return await fetch(body.redirectTo, {
      method: "POST",
      headers: constants.JSON_HEADER,
      body: JSON.stringify(body)
    } )
        .then(async response => {
          return await response.json();
        }).catch(err => {
          return {
            error: err.toString()
          }
        } );
  } ).catch(error => {
    return {
      error: error.toString()
    };
  } );
}

module.exports = {
  setErrorResponse,
  setBodyResponse,
  getDate,
  areAnyUndefined,
  newError,
  postToGateway,
  getDateFromCreatedAtAttribute
}
