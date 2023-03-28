const express = require("express");
const logsDAL = require('../DAL/logs');
const auth = require('./authMiddlewares');
const httpStatusCodes = require("http-status-codes").StatusCodes;

const router = express.Router();


router.get('/logs', auth.isAdmin, async function (req, res, next) {
    try {
        let logs = await logsDAL.getLogs();
        res.send(logs);
    }
    catch (err) {
        res.status(httpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR);
        next(err);
    }
});

module.exports = router;