const usersDAL = require('../../../DAL/users');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const customFields = { usernameField: 'mail', passwordField: 'password' }

async function authenticationCB(mail, password, done) {
    try {
        const user = await usersDAL.getUserByMail(mail);
        if (!user) {
            return done(null, false, { message: 'Account with given email does not exist' });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
    }
    catch (error) {
        done(error);
    }
}


module.exports.configure = function (passport) {
    const strategy = new localStrategy(customFields, authenticationCB)

    passport.use(strategy);
    passport.serializeUser((user, done) => { done(null, user._id) });
    passport.deserializeUser(async (userId, done) => {
        try {
            const user = await usersDAL.getUserById(userId);
            done(null, user);
        }
        catch (error) {
            done(error)
        }
    });
}