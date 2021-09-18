const winston = require('winston');

module.exports = async function () {
    await winston.add(new winston.transports.File({
        filename: './logfile.log',
        level: 'error'
    }));

    await process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        process.exit();
    });

    await process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex);
        process.exit();
    });

    await winston.add(new winston.transports.Console({
        level: 'info'
    }));

}
