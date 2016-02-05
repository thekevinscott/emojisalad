'use strict';
console.log('Test Queue db is default');
const config = require(`./config/db`);
let db = require('../db')(config);
module.exports = db;
