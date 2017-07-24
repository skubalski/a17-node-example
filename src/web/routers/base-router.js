'use strict';
const {Router} = require('express');
const {Logger} = require('../../lib/logger');
const pgDb = require('../../lib/database');
const {ResponseFactory} = require('../utilities/response-factory');

class BaseRouter {
    constructor() {
        this._router = Router();
        this._logger = Logger.getInstance();
        this._pgDb = pgDb;
        this._responseFactory = ResponseFactory.getInstance();
    }

    _createGetRoute(name, func) {
        this._router.get(name, func);
    }

    _createDeleteRoute(name, func) {
        this._router.delete(name, func);
    }

    _createPatchRoute(name, func) {
        this._router.patch(name, func);
    }

    _createPostRoute(name, func) {
        this._router.post(name, func);
    }

    _createRoute(name, router) {
        this._router.use(name, router);
    }

    _setMiddleware(middleware) {
        this._router.use(middleware);
    }

    getRouter() {
        return this._router;
    }

    getUri() {
    }

    _setRoutes() {
    }
}

module.exports = {BaseRouter};