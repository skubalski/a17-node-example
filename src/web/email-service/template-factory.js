'use strict';
const pug = require('pug');
const path = require('path');
const gpc = require('generate-pincode');

class BaseTemplateFactory {
    _getTemplate() {
        return pug.compileFile(path.join(__dirname, 'templates', this._getContentFileName()));
    }

    getSubject() {
    }

    getContent() {
        return this._getTemplate();
    }

    _getContentFileName() {
    }

    getFiles() {
        return [];
    }
}

class VerificationCodeTemplateFactory extends BaseTemplateFactory{
    constructor(fileContent) {
        super();
        this._fileContent = fileContent;
    }

    getSubject() {
        return 'New verification code';
    }

    _getContentFileName() {
        return 'verification_code.pug';
    }

    getFiles() {
        return [{
            filename: `qr-code-${gpc(6)}`,
            content: this._fileContent
        }];
    }
}

module.exports = {
    VerificationCodeTemplateFactory
};