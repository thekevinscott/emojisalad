import {
  ENVIRONMENT,
} from './config/app';
console.info(`App Queue db: ${ENVIRONMENT}`);
const config = require('./config/db');

module.exports = require('../db')(config);
module.exports.api = require('../db')(config.api);
module.exports.sms = require('../db')(config.sms);
