'use strict';
const {BaseRouter} = require('./base-router');
const {InvalidCredentialsError, ServerError, BadRequestError} =
  require('../utilities/error-factory');

class ValidationRouter extends BaseRouter {
  constructor() {
    super();
    this._validate = this._validate.bind(this);
    this._setRoutes();
  }

  async _validate(req, res, next) {
    try {
      //todo: validate user credentials
    } catch (e) {
      this._responseFactory.propagateError(next, new ServerError(err));
    }
  }

  _setRoutes() {
    this._createPostRoute('/', this._validate);
  }

  getUri() {
    return '/validate'
  }
}

module.exports = {ValidationRouter};