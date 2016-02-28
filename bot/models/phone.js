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
    //console.log('its about to happen');
    return service('phone', 'parse', params);
  },
};

module.exports = Phone;
