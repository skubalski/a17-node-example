'use strict';

const {BaseRouter} = require('./base-router');
const {NotFoundError} = require("../utilities/error-factory.js");

class Router404 extends BaseRouter {
    constructor() {
        super();
        this._handle404 = this._handle404.bind(this);
        this._setRoutes();
    }

    _setRoutes() {
        this._createRoute(this.getUri(), this._handle404);
    }

    _handle404(req, res, next) {
        this._responseFactory.propagateError(next, new NotFoundError());
    }

    getUri() {
        return '*';
    }
}

module.exports = {Router404};