'use strict';
const {BaseRouter} = require('./base-router');
const {InvalidCredentialsError, ServerError, BadRequestError} =
  require('../utilities/error-factory');

class ResetPasswordRouter extends BaseRouter {
  constructor() {
    super();
    this._resetPassword = this._resetPassword.bind(this);
    this._setRoutes();
  }

  _setRoutes() {
    this._createPostRoute('/', this._resetPassword);
  }

  async _resetPassword(req, res, next) {
    try {
      //todo: reset password, generate new QR code and send QR via email
    } catch (e) {
      this._responseFactory.propagateError(next, new ServerError(err));
    }
  }

  getUri() {
    return '/reset-password'
  }
}

module.exports = {ResetPasswordRouter};