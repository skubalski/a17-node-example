'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const {Logger} = require('../lib/logger');
const {AppRouter} = require('./routers');
const {ResponseFactory} = require('./utilities/response-factory');
const morgan = require('morgan');
const http = require('http');
const {Router404} = require('./routers/404-router');
const path = require('path');

const PORT = process.env.PORT || 5000;

class App {
    constructor() {
        this._app = express();
        this._logger = Logger.getInstance();
        this._responseFactory = ResponseFactory.getInstance();

        this._server = http.Server(this._app);

        this._app.set('port', PORT);
        this._app.use(morgan('dev'));
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({extended: false}));

        this._setCors();

        this._serveStaticFiles();

        this._createRoutes();
        this._create404Routes();
        this._createErrorHandler();
    }

    static run() {
        new App().listen();
    }

    _serveStaticFiles() {
      this._app.use(express.static(path.join(__dirname, 'public')));
    }

    _setCors() {
        const corsSettings = cors();
        this._app.use(corsSettings);
        this._app.options('*', corsSettings);
    }

    _createRoutes() {
        const appRouter = new AppRouter();
        this._app.use(appRouter.getUri(), appRouter.getRouter());
    }

    _create404Routes() {
        const router404 = new Router404();
        this._app.use(router404.getUri(), router404.getRouter())
    }

    _createErrorHandler() {
        this._app.use((err, req, res, next) => {
            this._responseFactory.buildErrorResponse(res, err);
        });
    }

    listen() {
        this._server.listen(PORT, () => {
            this._logger.info(`'Node app is running on port: ${PORT}'`);
        });
    }
}

module.exports = {App};