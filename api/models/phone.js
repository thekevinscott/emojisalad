'use strict';
var config = require('../config/twilio');
var Promise = require('bluebird');

var LookupsClient = require('twilio').LookupsClient;
var client = new LookupsClient(config.accountSid, config.authToken);

var Phone = {
  parse: function(passedNumber) {
    if ( ! passedNumber ) {
      return Promise.reject(new Error(8));
    } else {
      var getAsync = Promise.promisify(client.phoneNumbers(passedNumber).get);
      return getAsync().then(function(number) {
        return number.phoneNumber;
      }).catch(function() {
        throw new Error(1);
      });
    }
  }
};

module.exports = Phone;
