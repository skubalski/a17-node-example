'use strict';
const {BaseRouter} = require('./base-router');
const {ValidationRouter} = require('./validation-router');
const {ResetPasswordRouter} = require('./reset-password-router');

class AppRouter extends BaseRouter {
    constructor() {
        super();
        this._resetPasswordRouter = new ResetPasswordRouter();
        this._validationRouter = new ValidationRouter();
        this._setRoutes();
    }

    _setRoutes() {
        this._createRoute(this._resetPasswordRouter.getUri(), this._resetPasswordRouter.getRouter());
        this._createRoute(this._validationRouter.getUri(), this._validationRouter.getRouter());
    }

    getUri() {
        return '/api/v1';
    }
}

module.exports = {AppRouter};