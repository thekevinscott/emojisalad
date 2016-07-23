'use strict';
console.info(`App Queue db: ${process.env.ENVIRONMENT}`);
//const config = require(`./config/database/${process.env.ENVIRONMENT}`);
const config = require('./config/db');
const db = require('../db')(config);
const apidb = require('../db')(config.api);
module.exports = db;
module.exports.api = apidb;
