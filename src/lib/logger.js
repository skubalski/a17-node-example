'use strict';

class Logger {
    static getInstance() {
        if(!Logger._instance) {
            Logger._instance = new Logger();
        }
        return Logger._instance;
    }

    info(message) {
        console.log(message);
    }

    error(err) {
        console.error(err);
    }
}

module.exports = {Logger};