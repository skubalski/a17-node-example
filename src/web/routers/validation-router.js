'use strict';
const {BaseRouter} = require('./base-router');
const {InvalidCredentialsError, ServerError, BadRequestError} = require('../utilities/error-factory');

const GET_VERIFIED_USER = 'SELECT * FROM a17_heroku.get_verified_user($[employeeEmail], $[verificationCode])';
const LOG_OFFICE = 'SELECT a17_heroku.log_office($[employeeId], $[officeId], $[isAlreadyPresent])';

class ValidationRouter extends BaseRouter {
    constructor() {
        super();
        this._validate = this._validate.bind(this);
        this._setRoutes();
    }

    async _validate(req, res, next) {
        try {
            if (req.body.email && req.body.password) {
                const user = await this._pgDb.oneOrNone(GET_VERIFIED_USER, {
                    employeeEmail: req.body.email,
                    verificationCode: req.body.password
                });
                if(user) {
                    await this._pgDb.none(LOG_OFFICE, {
                        employeeId: user.user_id,
                        officeId: user.account_id,
                        isAlreadyPresent: user.is_already_present
                    });
                } else {
                    this._responseFactory.propagateError(next, new InvalidCredentialsError(err));
                }
                this._responseFactory.buildSuccessResponse(res, 200);
            } else {
                this._responseFactory.propagateError(next, new BadRequestError(err));
            }
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