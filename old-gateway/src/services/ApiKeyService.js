const constants = require("../others/constants");
const ApiKeys = require("../data/Apikeys");
const checkApiKeyUp = require("./checkApiKeyUp");
const checkApiKeyExists = require("./checkApiKeyExists");
const Logger = require("./Logger");
const {
  setBodyResponse,
  getSHAOf,
  getFormatedDate
} = require("../others/utils");
const {Op} = require("sequelize");
const crypto = require("crypto");
const {setErrorResponse} = require("../others/utils");
const fetch = require('node-fetch');

class ApiKeyService {
  defineEvents(app) {
    /**
     * @swagger
     * /redirect:
     *   post:
     *    summary: Redirects request to server, if authorized.
     *
     *    description: Checks if api-key is valid and redirects. Otherwise
     *    the request is rejected.
     *
     *    parameters:
     *         - name: "apiKey"
     *           in: body
     *           type: "string"
     *           required: true
     *
     *         - name: "redirectTo"
     *           in: body
     *           type: "string"
     *           required: true
     *
     *    responses:
     *         "200":
     *           descritption: "Returning data."
     *
     *         "401":
     *           descritption: "Unauthorized."
     *
     *         "500":
     *           description: "Fatal error."
     */
    app.post(constants.REDIRECT_URL,
      this.redirect
        .bind(this));

    /**
     * @swagger
     * /apikeys/down:
     *   post:
     *    summary: Disable api key
     *
     *    description: Sets the status of an api key as inactive.
     *
     *    parameters:
     *         - name: "apiKey"
     *           in: body
     *           type: "string"
     *           required: true
     *
     *         - name: "apiKeyToDisable"
     *           in: body
     *           type: "string"
     *           required: true
     *
     *    responses:
     *         "200":
     *           description: "Key disabled."
     *
     *         "401":
     *           descritption: "Unauthorized."
     *
     *         "462":
     *           description: "Given api key does not exist."
     *
     *         "500":
     *           description: "Fatal error."
     */
    app.post(constants.API_KEY_DOWN_URL,
      this.disableApiKey.bind(this));

    /**
     * @swagger
     * /apikey/up:
     *   post:
     *    summary: Enable api key
     *
     *    description: Sets the status of an api key as active, and
     *    creates it if it does not exist.
     *
     *    parameters:
     *         - name: "apiKey"
     *           in: body
     *           type: "string"
     *           required: true
     *
     *         - name: "apiKeyToEnable"
     *           in: body
     *           type: "string"
     *           required: false
     *
     *
     *    responses:
     *         "200":
     *           description: "Key enabled."
     *
     *         "401":
     *           descritption: "Unauthorized."
     *
     *         "500":
     *           description: "Fatal error."
     */
    app.post(constants.API_KEY_UP_URL,
      this.enableApiKey.bind(this));

    /**
     * @swagger
     * /users/createService:
     *   post:
     *    summary: Create service.
     *
     *    description: Create new service with name.
     *
     *    parameters:
     *         - name: "name"
     *           in: body
     *           type: "string"
     *           required: true
     *
     *         - name: "description"
     *           in: body
     *           type: "string"
     *           required: false
     *
     *    responses:
     *         "200":
     *           description: "Created service."
     *
     *         "400":
     *           description: "Bad Request. Name required."
     *
     *         "500":
     *           description: "Could not create service"
     */
    app.post(constants.API_KEY_CREATE_SERVICE_URL, this.createService.bind(this));

    /**
     * @swagger
     * /services:
     *   get:
     *    summary: returns api keys
     *
     *    description: returns a json with the info associated with
     *    the known api keys.
     *
     *    parameters:
     *         - name: "apiKey"
     *           in: path
     *           type: "string"
     *           required: true
     *
     *    responses:
     *         "200":
     *           description: "Key disabled."
     *
     *         "401":
     *           descritption: "Unauthorized."
     *
     *         "500":
     *           description: "Fatal error."
     */
    app.get(constants.SERVICES_URL, this.getServices.bind(this));
  }

  getNewApiKey() {
    return getSHAOf(crypto.randomBytes(20)
      .toString('hex'));
  }

  async redirect(req,
                 res) {
    Logger.info("Request a /redirect");

    if (!await checkApiKeyUp(req.body
        .apiKey,
      req.body
        .redirectTo)) {
      return setErrorResponse("No autorizado",
        401,
        res);
    }

    const redirectParams = req.body
      .redirectParams !== undefined
      ? req.body
        .redirectParams
      : "";

    const redirectTo = req.body
      .redirectTo + redirectParams;

    const verbRedirect = req.body
      .verbRedirect;

    req.body
      .redirectTo = "";

    req.body
      .verbRedirect = "";

    const requestData = {
      method: verbRedirect,
      headers: constants.JSON_HEADER
    };

    if (verbRedirect !== "GET"
      && verbRedirect !== "HEAD") {
      requestData.body = JSON.stringify(req.body);
    }

    let json;
    let status = 0;

    const response = await fetch(redirectTo,
      requestData)
      .then(async response => {
        const jsonResponse = await response.json();

        if (jsonResponse.error !== undefined) {
          json = {
            error: jsonResponse.error
              .toString()
          }

        } else {
          json = jsonResponse;
        }

        status = response.status;
      }).catch(err => {
          json = {
            error: err.toString()
          }

          status = 500;
        }
      );

    return setBodyResponse(json,
      status,
      res);
  }

  async disableApiKey(req, res) {
    Logger.info("Request a /apikeys/down");

    if (!await checkApiKeyUp(req.body.apiKey)) {
      return setErrorResponse("No autorizado", 401, res);
    }

    if (!await checkApiKeyExists(req.body.apiKeyToChange)) {
      return setErrorResponse("El servicio indicado no existe", 404, res);
    }

    const response = await ApiKeys.update({
      active: false
    }, {
      where: {
        apiKey: req.body.apiKeyToChange
      }
    }).catch(error => {
      return {
        error: error.toString()
      }
    });

    if (response.error !== undefined) {
      Logger.error("No se pudo actualizar la base de datos.");
      return setErrorResponse("Error al deshabilitar la api key.", 500, res);
    }
    const responseBody = {
      ok: "ok"
    }
    return setBodyResponse(responseBody, 200, res);
  }

  async enableApiKey(req,
                     res) {
    Logger.info("Request a /apikeys/up");

    if (!await checkApiKeyUp(req.body.apiKey)) {
      return setErrorResponse("No autorizado", 401, res);
    }

    const response = await ApiKeys.update({
      active: true
    }, {
      where: {
        apiKey: req.body.apiKeyToChange
      }
    }).catch(error => ({
      error: error.toString()
    }));
    if (response.error !== undefined) {
      Logger.error("No se pudo consultar la base de datos");
      return setErrorResponse("Error al habilitar la api key.", 500, res);
    }

    const responseBody = {
      ok: "ok"
    }
    return setBodyResponse(responseBody, 200, res);
  }

  async createService(req, res) {
    Logger.info("Request a /apikeys/createservice");
    if (!await checkApiKeyUp(req.body.apiKey)) {
      return setErrorResponse("No autorizado", 401, res);
    }

    const newApiKey = this.getNewApiKey();

    const createResponse = await ApiKeys.create({
      name: req.body.name,
      apiKey: newApiKey,
      active: true,
      creationDate: getFormatedDate(new Date()),
      description: req.body.description
    }).catch(error => ({
      error: error.toString()
    }));

    if (createResponse.error !== undefined) {
      Logger.error("No se pudo actualizar la base de datos");
      return setErrorResponse("Error al habilitar la api key.", 500, res);
    }

    const responseBody = {
      ok: "ok"
    }
    return setBodyResponse(responseBody, 200, res);
  }

  async getServices(req, res) {
    Logger.info("Request a /services");

    if (!await checkApiKeyUp(req.query
      .apiKey)) {
      return setErrorResponse("No autorizado", 401, res);
    }

    const response = await ApiKeys.findAll({
      attributes: [
        'id',
        'name',
        'apiKey',
        'active',
        'creationDate',
        'description']
    })
      .catch(error => {
        return {
          error: error.toString()
        }
      });

    if (response.error !== undefined) {
      Logger.error("No se pudo consultar la base de datos para consultar los servicios");

      return setErrorResponse("Error al consultar los servicios.",
        500,
        res);
    }

    return setBodyResponse(response,
      200,
      res);
  }

}

module.exports = ApiKeyService;
