const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const path = require('path');
const auth = require('./authMiddlewares');
const config = require('../configuration/app');
const usersDAL = require('../DAL/users');
const mailer = require('../services/mailer');

const router = express.Router();

router.post("/login", auth.isNotAuth, passport.authenticate('local',
    { successRedirect: '/success-login', failureRedirect: '/failure-login', failureFlash: true }));

router.delete("/logout", auth.isAuth, function (req, res) {
    req.logOut();
    res.send({ status: true });
});

router.post('/forgot-password', auth.isNotAuth, async function (req, res, next) {
    try {
        const user = await usersDAL.getUserByMail(req.body.mail);
        if (!user) {
            res.send({ status: false, message: 'Accound with given mail does not exist' })
        }

        // Here we create token
        const token = jwt.sign({ id: user.id, oldPassword: user.password }, config.secret, { expiresIn: '5m' });

        const resetLink = `${config.client_base_url}/reset-password/${token}`

        await mailer.sendMail(user.mail,
            'Reset-Password',
            `Reset password link: ${resetLink}`,
            `In order to reset password <a href=${resetLink}> Click Here </a>`)

        res.send({ status: true, message: 'A link for reseting password sent to the given mail' });
    }
    catch (err) {
        next(err);
    }
});

router.post('/reset-password', auth.isNotAuth, async function (req, res, next) {
    try {
        if (!req.body.resetToken) {
            let error = new Error();
            error.clientMessage = "Valid reset token is needed";
            throw error;
        }

        const verifiedToken = jwt.verify(req.body.resetToken, config.secret);

        // Check if token already used successfully - if yes, do not update password again.
        // If token not used - user password in db and password that signed in token should be the same,
        // Otherwise - password already changed with this token.
        const user = await usersDAL.getUserById(verifiedToken.id);
        if (user.password !== verifiedToken.oldPassword) {
            let error = new Error();
            error.clientMessage = "Reset link already used";
            throw error;
        }

        await usersDAL.updatePassword(verifiedToken.id, req.body.newPassword);
        res.send({ status: true, message: 'Password was successfully updated' });
    }
    catch (err) {
        next(err);
    }
});

router.get("/success-login", function (req, res) {
    res.send({ status: true });
});

router.get("/failure-login", function (req, res, next) {
    try {
        errorMessage = req.flash().error[0];
        res.send({ status: false, message: errorMessage });
    } catch (error) {
        error.clientMessage = 'failure-login';
        next(error);
    }
});

module.exports = router;