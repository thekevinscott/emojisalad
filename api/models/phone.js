'use strict';
// we always use production
//const config = require('../../config/twilio').production;
//const Promise = require('bluebird');
//const LookupsClient = require('twilio').LookupsClient;
//const client = new LookupsClient(config.accountSid, config.authToken);
const validate = require('phone');

const Phone = {
  parse: (passed_number) => {
    return new Promise((resolve, reject) => {
      const parsed_number = validate(passed_number);
      if ( parsed_number && parsed_number.length ) {
        // for twilio, pass the +
        if (passed_number.indexOf(0) === '+') {
          resolve(parsed_number.shift());
        } else {
          resolve(parsed_number.shift().slice(1));
        }
      } else {
        if ( process.env.ENVIRONMENT === 'test' ) {
          //console.log('this is test!', passed_number);
          if ( passed_number.length === 12 && passed_number.substring(0, 5) === '+1555') {
            //console.log('resolve it, because its a test');
            resolve(passed_number);
          } else {
            //console.log('its test, but still a crap number', passed_number);
            reject(1);
          }
        } else {
          reject(1);
        }
      }
    });
  }
};

module.exports = Phone;
