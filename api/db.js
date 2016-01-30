const config = require(`./config/database/${process.env.ENVIRONMENT}`);
module.exports = require('../db')(config);
