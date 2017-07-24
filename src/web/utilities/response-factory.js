/**
 * @Author Sebastian Kubalski
 * @Email sebastian.kubalski@gmail.com
 * @Date Creation 25/04/2017
 * @Description
 */

'use strict';
const moment = require('moment');
const {Logger} = require('../../lib/logger');

class ResponseFactory {
    constructor() {
        this._logger = Logger.getInstance();
    }

    static _buildResponse(success, data) {
        return Object.assign({
                success,
                time: moment().format()
            },
            data
        );
    }

    static getInstance() {
        if (!ResponseFactory._instance) {
            ResponseFactory._instance = new ResponseFactory();
        }
        return ResponseFactory._instance;
    }

    buildSuccessResponse(res, status, payload = null) {
        res.status(status).json(ResponseFactory._buildResponse(true, {payload}));
    }

    buildSuccessMessage(socket, eventName, payload) {
        socket.emit(eventName, ResponseFactory._buildResponse(true, {payload}));
    }

    buildErrorMessage(socket, eventName, err) {
        socket.emit('error', ResponseFactory._buildResponse(false, {
            error_message: err.getMessage(),
            event_name: eventName
        }));
    }

    buildErrorResponse(res, err) {
        this._logger.error(err);
        res
            .status(err.getStatus() || 500)
            .json(
                ResponseFactory._buildResponse(
                    false,
                    {
                        error_message: err.getMessage()
                    }
                )
            );
    }

    propagateError(next, err) {
        this._logger.error('Error request');
        next(err);
    }
}

module.exports = {ResponseFactory};