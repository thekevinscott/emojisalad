console.log('Bot db', process.env.ENVIRONMENT);
//console.log(process.env);
const config = require(`./config/database/${process.env.ENVIRONMENT}`);
let db = require('../db')(config);
module.exports = db;
