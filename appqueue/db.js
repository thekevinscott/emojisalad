'use strict';
console.info(`App Queue db: ${process.env.ENVIRONMENT}`);
//const config = require(`./config/database/${process.env.ENVIRONMENT}`);
const config = require('./config/db');

module.exports = require('../db')(config);
module.exports.api = require('../db')(config.api);
module.exports.sms = require('../db')(config.sms);
