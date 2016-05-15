'use strict';
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
console.info(`SMS db: ${ENVIRONMENT}`);
const config = require(`config/database/${ENVIRONMENT}`);
const db = require('../db')(config);
module.exports = db;
