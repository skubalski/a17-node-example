'use strict';
const rp = require('request-promise');
const Promise = require('bluebird');


class SalesforceHelper {
    constructor() {
        this._host = `https://${process.env.IS_SANDBOX ? 'test' : 'login'}.salesforce.com`;
        this._password = process.env.SF_PASSWORD;
        this._username = process.env.SF_USERNAME;
        this._secret = process.env.SF_SECRET;
        this._customerKey = process.env.SF_CUSTOMER_KEY;
        this._customerSecret = process.env.SF_CUSTOMER_SECRET;
    }

    async login() {
        try {
            const response = await this._doRequest('POST', '/services/oauth2/token', {
                grant_type: 'password',
                client_id: this._customerKey,
                client_secret: this._customerSecret,
                username: this._username,
                password: `${this._password}${this._secret}`
            });
            this._token = response.access_token;
        } catch(e) {
            return Promise.reject(e); //todo: create custom login exception
        }
    }

    _doRequest(method, uri, body = {}, headers = {}) {
        return rp({
            method,
            uri: `${this._host}${uri}`,
            body,
            headers,
            json: true
        });
    }

    _getHeaders() {
        return {
            Authorization: `Bearer ${this._token}`
        }
    }

    _checkAuthentication() {
        if(!this._token) {
            throw new Error() //todo: create unauthenticated exception
        }
    }

    async resetVerificationCode(userId) {
        try {
            this._checkAuthentication();
            return await this._doRequest('POST', '/', {userId}, this._getHeaders()); //todo: set correct endpoint
        } catch(e) {
            return Promise.reject(e) //todo: create bad request exception
        }
    }
}

module.exports = {SalesforceHelper};