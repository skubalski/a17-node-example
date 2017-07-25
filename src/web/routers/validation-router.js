'use strict';
const {BaseRouter} = require('./base-router');
const {InvalidCredentialsError, ServerError, BadRequestError} = require('../utilities/error-factory');
const {queryResult} = require('pg-promise');

const GET_VERIFIED_USER = 'a17_heroku.get_verified_user';
const LOG_OFFICE = 'a17_heroku.log_office';

class ValidationRouter extends BaseRouter {
    constructor() {
        super();
        this._validate = this._validate.bind(this);
        this._setRoutes();
    }

    _validate(req, res, next) {
        if (req.body.email && req.body.password) {
            this._pgDb.task(async conn => {
                try {
                    const user = await conn.func(
                        GET_VERIFIED_USER,
                        [req.body.email, req.body.password],
                        queryResult.one | queryResult.none
                    );
                    if (user) {
                        await conn.func(LOG_OFFICE,
                            [user.user_id, user.account_id, user.is_already_present]
                        );
                    } else {
                        this._responseFactory.propagateError(next, new InvalidCredentialsError());
                    }
                    this._responseFactory.buildSuccessResponse(res, 200);
                } catch (err) {
                    this._responseFactory.propagateError(next, new ServerError(err));
                }
            });
        } else {
            this._responseFactory.propagateError(next, new BadRequestError());
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