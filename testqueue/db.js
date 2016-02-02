'use strict';
const config = require(`./config/db`);
let db = require('../db')(config);
module.exports = db;
