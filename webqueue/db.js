'use strict';
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
console.info(`Webqueue db: ${ENVIRONMENT}`);
const config = require(`config/database/${ENVIRONMENT}`);
const db = require('../db')(config);
module.exports = db;
