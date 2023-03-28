const userModel = require('./userModel');
const bcrypt = require('bcrypt');


module.exports.getUserById = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return false;
        }

        return user;
    }
    catch (error) {
        throw error;
    }
}

module.exports.getUserByMail = async (_mail) => {
    try {
        const user = await userModel.findOne({ mail: _mail });
        if (!user) {
            return false;
        }

        return user;
    }
    catch (error) {
        throw error;
    }
}

module.exports.updatePassword = async (id, password) => {
    try {
        if (!validatePassword(password)) {
            let error = new Error();
            error.clientMessage = "password can not be empty string";
            throw error;
        }

        const user = await this.getUserById(id);
        if (!user) {
            let error = new Error();
            error.clientMessage = "User not found";
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
    }
    catch (error) {
        throw error;
    }
}

module.exports.addUser = async (_name, _mail, _password, _admin = false, _data = []) => {
    try {
        validateUserFields(_name, _mail, _password);
        const hashedPassword = await bcrypt.hash(_password, 10);
        const user = new userModel({
            name: _name,
            mail: _mail,
            password: hashedPassword,
            admin: _admin,
            data: _data
        });

        await user.save();
    }
    catch (error) {
        if (error.message.includes('duplicate key')) {
            error.clientMessage = 'Email already in use';
        }
        throw error;
    }
}

// Update user fields except of password, id, admin and mail 
module.exports.updateUser = async (updatedUser) => {
    try {
        validateUserFields(updatedUser.name, updatedUser.mail, updatedUser.password);
        const user = await this.getUserById(updatedUser._id);
        user.name = updatedUser.name;
        user.data = updatedUser.data;
        await user.save();
        return user;
    }
    catch (error) {
        throw error;
    }
}

function validateUserFields(name, email, password) {
    if (!(validateName(name) && validateEmail(email) && validatePassword(password))) {
        let error = new Error();
        error.clientMessage = 'INVALID INPUT';
        throw (error);
    }
}

function validateName(name) {
    return name.trim().length;
}

function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.trim().length;
}