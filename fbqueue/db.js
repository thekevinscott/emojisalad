'use strict';
console.info('SMS db: default');
const config = require(`./config/db`);
const db = require('../db')(config);
module.exports = db;
