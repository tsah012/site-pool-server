const logModel = require('./logModel');


module.exports.getLogs = async function () {
    try {
        const data = logModel.find();
        return data;
    } catch (error) {
        throw (error);
    }
}