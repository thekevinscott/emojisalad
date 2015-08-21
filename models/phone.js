var config = require('../config/twilio');
var _ = require('lodash');
var Q = require('q');

var squel = require('squel');

var db = require('db');

var LookupsClient = require('twilio').LookupsClient;
var client = new LookupsClient(config.accountSid, config.authToken);

var Phone = {
  parse: function(passedNumber) {
    var dfd = Q.defer();
    //console.log('input number', passedNumber);
    client.phoneNumbers(passedNumber).get(function(err, number) {
      if ( err ) {
        //console.log('there was an error', err);
        dfd.reject({
          message: "Number is not a valid phone number: " + passedNumber,
          errno: 1
        });
      } else {
        dfd.resolve(number.phoneNumber);
      }
    });
    return dfd.promise;
  }
};

module.exports = Phone;
