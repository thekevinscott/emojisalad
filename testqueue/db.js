'use strict';
console.info('Test Queue db: default');
const config = require(`./config/db`);
let db = require('../db')(config);
module.exports = db;
