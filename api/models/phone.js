var config = require('../config/twilio');
var _ = require('lodash');
var Promise = require('bluebird');

var squel = require('squel');

var db = require('db');

var LookupsClient = require('twilio').LookupsClient;
var client = new LookupsClient(config.accountSid, config.authToken);

var Phone = {
  parse: function(passedNumber) {
    var deferred = Promise.pending();
    if ( ! passedNumber ) {
      return Promise.reject(new Error(8));
    } else {
      var getAsync = Promise.promisify(client.phoneNumbers(passedNumber).get);
      return getAsync().then(function(number) {
        return number.phoneNumber;
      }).catch(function(err) {
        throw new Error(1);
      });
    }
  }
};

module.exports = Phone;
