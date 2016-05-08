console.info(`Admin db: ${process.env.ENVIRONMENT}`);
const config = require(`./config/database/${process.env.ENVIRONMENT}`);
const db = require('../db')(config);

module.exports = db;
