const process = require('process');
const root = process.cwd();

module.exports = {
    port: process.env.PORT,
    root: root,
    client_base_url: process.env.CLIENT_BASE_URL,
    dbConnectionString: process.env.DB_CONNECTION_STRING,
    dbName: process.env.DB_NAME,
    usersCollection: process.env.USERS_COLLECTION,
    logsCollection: process.env.LOGS_COLLECTION,
    sessionsCollection: process.env.SESSIONS_COLLECTION,
    secret: process.env.SECRET,
    mailBox: process.env.MAIL_BOX,
    mailPassword: process.env.MAIL_PASSWORD,
    sessionExpDate: 24 * 60 * 60 * 1000 // time in milliseconds
}