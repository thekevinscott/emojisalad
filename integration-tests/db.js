//console.log(process.env);
const config = require(`./config/test-db`);
let db = require('../db')(config);
module.exports = db;
