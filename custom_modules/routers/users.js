const express = require("express");
const usersDAL = require('../DAL/users');
const auth = require('./authMiddlewares');
const httpStatusCodes = require("http-status-codes").StatusCodes;
const router = express.Router();

router.post('/add', async function (req, res, next) {
    try {
        await usersDAL.addUser(req.body.name, req.body.mail, req.body.password);
        res.status(httpStatusCodes.CREATED).send({ status: true, message: 'Request ended successfully' });
    }
    catch (err) {
        next(err);
    }
});


// Authenticated routes - only if user is logged in
//------------------------------------------------------------------

router.post('/', auth.isAuth, async function (req, res, next) {
    try {
        const user = await usersDAL.updateUser(req.body.user);
        res.status(httpStatusCodes.OK).send({ status: true, user: user });
    }
    catch (err) {
        next(err);
    }
});

router.get('/', auth.isAuth, async function (req, res, next) {
    try {
        let user = req.user;
        delete user.password;
        res.send(user);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;