'use strict';
class BaseError extends Error {
    getStatus() {
        return this._status;
    }

    getMessage() {
        return this._message;
    }
}

class NotFoundError extends BaseError {
    constructor() {
        super();
        this._message = 'Not Found';
        this._status = 404;
    }
}

class InvalidEmployeeId extends BaseError {
    constructor() {
        super();
        this._message = 'Invalid employee id';
        this._status = 400;
    }
}

class MissingAuthenticationMethodError extends BaseError {
    constructor() {
        super();
        this._message = 'Authorization method is missing';
        this._status = 401;
    }
}

class MissingAuthorizationTokenError extends BaseError {
    constructor() {
        super();
        this._message = 'Token is missing';
        this._status = 401;
    }
}

class InvalidAuthorizationToken extends BaseError {
    constructor() {
        super();
        this._message = 'Invalid token';
        this._status = 401;
    }
}

class InvalidCredentialsError extends BaseError {
    constructor() {
        super();
        this._message = 'Invalid email, password or api key.';
        this._status = 401;
    }
}

class ServerError extends BaseError {
    constructor() {
        super();
        this._message = 'Server error';
        this._status = 500;
    }
}

class BadRequestError extends BaseError {
    constructor() {
        super();
        this._message = 'Data is missing or is incorrect';
        this._status = 400;
    }
}

module.exports = {
    NotFoundError,
    MissingAuthenticationMethodError,
    MissingAuthorizationTokenError,
    InvalidAuthorizationToken,
    InvalidCredentialsError,
    ServerError,
    BaseError,
    BadRequestError,
    InvalidEmployeeId
};