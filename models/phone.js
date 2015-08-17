var config = require('../config/twilio');
var _ = require('lodash');
var Q = require('q');

var squel = require('squel');

var db = require('db');

var LookupsClient = require('twilio').LookupsClient;
var client = new LookupsClient(config.accountSid, config.authToken);

var Phone = {
  parse: function(number) {
    var dfd = Q.defer();
    client.phoneNumbers(number).get(function(err, number) {
      if ( err ) {
        dfd.reject("Number is not a valid phone number: " + number);
      } else {
        dfd.resolve(number.phoneNumber);
      }
    });
    return dfd.promise;
  }
};

module.exports = Phone;
