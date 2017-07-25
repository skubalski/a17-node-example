'use strict';
const {BaseRouter} = require('./base-router');
const {InvalidCredentialsError, ServerError, BadRequestError} =
    require('../utilities/error-factory');
const {SalesforceHelper} = require('../../lib/salesforce-helper');
const {QrHelper} = require('../../lib/qr-helper');
const {EmailService} = require('../email-service');
const {queryResult} = require('pg-promise');

const GET_USER_BY_EMAIL = 'a17_heroku.get_user_by_email';

class ResetPasswordRouter extends BaseRouter {
    constructor() {
        super();
        this._salesforceHelper = new SalesforceHelper();
        this._qrHelper = new QrHelper();
        this._resetPassword = this._resetPassword.bind(this);
        this._setRoutes();
    }

    _setRoutes() {
        this._createPostRoute('/', this._resetPassword);
    }

    async _resetPassword(req, res, next) {
        try {
            if (req.body.email) {
                const user = await this._pgDb.task(conn => {
                    return conn.func(GET_USER_BY_EMAIL, [req.body.email], queryResult.one | queryResult.none);
                });
                if (user) {
                    await this._salesforceHelper.login();
                    const updatedUser = await this._salesforceHelper.resetVerificationCode(user.id);
                    this._qrHelper.createQr(JSON.stringify({
                        email: req.body.email,
                        verification_code: updatedUser.verification_code__c
                    }));
                    const qrCode = this._qrHelper.getData();
                    await EmailService.sendVerificationCode(
                        req.body.email,
                        user.name,
                        updatedUser.verification_code__c,
                        qrCode
                    );
                    this._responseFactory.buildSuccessResponse(res, 200);
                } else {
                    this._responseFactory.propagateError(next, new InvalidCredentialsError(err));
                }
            } else {
                this._responseFactory.propagateError(next, new BadRequestError(err));
            }
        } catch (e) {
            this._responseFactory.propagateError(next, new ServerError(err));
        }
    }

    getUri() {
        return '/reset-password'
    }
}

module.exports = {ResetPasswordRouter};