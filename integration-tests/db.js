//console.log(process.env);
const config = require(`./config/test-db`);
module.exports = require('../db')(config);
module.exports.api = require('../db')(config.api);
