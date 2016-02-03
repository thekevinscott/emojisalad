console.log('Test Queue db is default');
'use strict';
const config = require(`./config/db`);
let db = require('../db')(config);
module.exports = db;
