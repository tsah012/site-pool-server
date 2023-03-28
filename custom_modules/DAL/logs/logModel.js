const config = require('../../configuration/app');
const mongoose = require('mongoose');

// Build model just for queries on logs and passing data as it is directly to client.
// Therefore, using empty schema. (saving logs is done through winston lib) 
const logSchema = new mongoose.Schema({});

module.exports = mongoose.model(config.logsCollection, logSchema);