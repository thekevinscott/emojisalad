'use strict';
// we always use production
const config = require('../../config/twilio').production;
const Promise = require('bluebird');
const LookupsClient = require('twilio').LookupsClient;
const client = new LookupsClient(config.accountSid, config.authToken);

let Phone = {
  parse: Promise.coroutine(function* (passed_numbers) {
    return yield Promise.all(passed_numbers.map(function(passed_number) {
      if ( ! passed_number ) {
        throw new Error(8);
      } else {

        if ( process.env.ENVIRONMENT !== 'test' ) {
          let getAsync = Promise.promisify(client.phoneNumbers(passed_number).get);

          return getAsync().then(function(number) {
            return number.phoneNumber;
          }).catch(function(err) {
            // 20404 means phone number was invalid,
            // so only show the error if it is 
            // not that
            if ( err && err.code !== 20404 ) {
              console.error('Twilio Error', err);
            }
            // Error 1 means phone number was invalid
            throw new Error(1);
          });
        } else {
          return passed_number;
        }
      }
    }));
  })
};

module.exports = Phone;
