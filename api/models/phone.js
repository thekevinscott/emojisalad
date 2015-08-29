var config = require('../config/twilio');
var _ = require('lodash');
var Promise = require('bluebird');

var squel = require('squel');

var db = require('db');

var LookupsClient = require('twilio').LookupsClient;
var client = new LookupsClient(config.accountSid, config.authToken);
//var phoneNumbers = Promise.promisify(client.phoneNumbers.get);

var Phone = {
  parse: function(passedNumber) {
    var deferred = Promise.pending();
    //console.log('input number', passedNumber);
    client.phoneNumbers(passedNumber).get(function(err, number) {
      if ( err ) {
        //console.error('there was an error', err);
        throw new Error(1);
        //deferred.reject({
          //message: "Number is not a valid phone number: " + passedNumber,
          //errno: 1
        //});
      } else {
        deferred.resolve(number.phoneNumber);
      }
    });
    return deferred.promise;
  }
};

module.exports = Phone;
