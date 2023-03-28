const config = require('../../configuration/app');
const winston = require('winston');
const format = winston.format;
require('winston-mongodb');

const mongoLoggerOptions = {
    options: { useUnifiedTopology: true },
    db: config.dbConnectionString + config.dbName,
    collection: config.logsCollection,
    level: 'error'
}

const logger = winston.createLogger({
    format: format.combine(format.timestamp(), format.errors({ stack: true })),
    transports: [
        new winston.transports.MongoDB(mongoLoggerOptions)
    ],
});

function saveLog(logObject) {
    try {
        logObject.localTimestamp = Date();
        logger.error('new error log. details in metadata', { metadata: logObject });
    } catch (error) {
        console.log('There was an error during adding a log to mongodb. error:\n' + error);
    }
}

module.exports = { saveLog };