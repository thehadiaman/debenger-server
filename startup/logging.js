const winston = require('winston');

module.exports = function () {
    winston.add(new winston.transports.File({
        filename: './logfile.log',
        level: 'error'
    }));

    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        process.exit();
    });

    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex);
        process.exit();
    });

    winston.add(new winston.transports.Console({
        level: 'info'
    }));

}
