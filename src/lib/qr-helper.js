'use strict';
const {imageSync} = require('qr-image');

class QrHelper {
    constructor() {
        this._type = 'png';
    }

    createQr(text) {
        this._data = imageSync(text, {type: this._type});
    }

    getData() {
        return this._data;
    }
}

module.exports = {QrHelper};