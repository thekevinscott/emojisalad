'use strict';
// we always use production
const config = require('../../config/twilio').production;
const Promise = require('bluebird');
const LookupsClient = require('twilio').LookupsClient;
const client = new LookupsClient(config.accountSid, config.authToken);

let Phone = {
  parse: function(passedNumber) {
    if ( ! passedNumber ) {
      return Promise.reject(new Error(8));
    } else {
      var getAsync = Promise.promisify(client.phoneNumbers(passedNumber).get);
      return getAsync().then(function(number) {
        return number.phoneNumber;
      }).catch(function(err) {
        // 20404 means phone number was invalid
        if ( err && err.code !== 20404 ) {
          console.error('Error parsing Twilio number', err);
        }
        throw new Error(1);
      });
    }
  }
};

module.exports = Phone;
