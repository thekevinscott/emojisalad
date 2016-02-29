'use strict';
// we always use production
const config = require('../../config/twilio').production;
const Promise = require('bluebird');
const LookupsClient = require('twilio').LookupsClient;
const client = new LookupsClient(config.accountSid, config.authToken);

const PROTOCOLS = process.env.PROTOCOLS.split(',');
if ( PROTOCOLS.length > 1 ) {
  console.log('***************************************');
  console.log('This will probably break because you need to figure out how to handle multiple queues');
}
const service = require('../service')(PROTOCOLS[0]);

const Phone = {
  parse: (params) => {
    console.info('its about to attempt to parse the phone', params, service);
    return service('phone', 'parse', params);
  },
};

module.exports = Phone;
