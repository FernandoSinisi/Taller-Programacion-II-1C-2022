const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { BASE_SALT } = require("../others/constants");
const sjcl = require('sjcl');

function setBodyResponse(responseBody,
                         status,
                         res) {
  res.status(status)
     .json(responseBody);
}

function setErrorResponse(error,
                          status,
                          res) {
  const responseBody = {
    error: error.toString()
  }

  setBodyResponse(responseBody, status, res);
}

function getDate() {
  return new Date().toISOString()
                   .substr(0, 10);
}

function replaceAll(str,
                    toReplace,
                    newStr) {
  return str.split(toReplace)
            .join(newStr)
}

function getSHAOf(toHash) {
  const myBitArray = sjcl.hash.sha256.hash(toHash)
  const myHash = sjcl.codec.hex.fromBits(myBitArray)
  return myHash;
}

// Credits:
// https://stackoverflow.com/questions/4816099/
// chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
/*function antiRecursiveStringify (object){
  let simpleObject = {};

  for (let prop in object ){
    if ( ! object.hasOwnProperty(prop)
        || (typeof(object[prop]) == 'object')
        || (typeof(object[prop]) == 'function') ) {
      continue;
    }
    simpleObject[prop] = object[prop];
  }

  // returns cleaned up JSON
  return JSON.stringify(simpleObject);
} */

function areAnyUndefined(list) {
  return list.filter( (element) => {
    return element === undefined
           || element.length === 0
  } ).length > 0;
}

function getFormatedDate(dateNow) {
  return dateNow.getDate() + "/"
        + parseInt(dateNow.getMonth() + 1)
        + "/"
        + dateNow.getFullYear();
}

function getHostFrom(url) {
  // +1 because of the second slash (/)
  // +1 because we do not want the slash
  const startIndex = url.indexOf("//") + 2;

  let destinyHost = url.substr(startIndex);

  const endIndex = destinyHost.indexOf("/");

  if (endIndex === -1) {
    return destinyHost;
  }

  return destinyHost.substr(0,
                            endIndex);
}

module.exports = {
  setErrorResponse,
  setBodyResponse,
  replaceAll,
  getDate,
  areAnyUndefined,
  getSHAOf,
  getFormatedDate,
  getHostFrom
}