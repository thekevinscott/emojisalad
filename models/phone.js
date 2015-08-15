var Q = require('q');
var squel = require('squel');

var db = require('../db');

var Phone = {
  // valid phone number test
  regex : /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
  table: 'users',

  // create a new phone number
  create: function(number) {
    var dfd = Q.defer();

    if ( ! number ) {
      dfd.reject('You must provide a phone number');
    } else if ( !this.regex.test(number) ) {
      dfd.reject('You must provide a valid phone number');
    } else {
      var user = {
        number: number
      };
      var query = squel
                  .insert()
                  .into(this.table)
                  .setFields(user);

      db.query(query).then(dfd.resolve).fail(function(err) {
        switch(err.errno) {
          case 1062:
            dfd.reject('Phone number is already registered');
            break;
          default: 
            console.error('error registering phone number', err);
            dfd.reject('There was an unknown error registering the phone number. Please try again later');
            break;
        }
      });
    }
    return dfd.promise;
  }
};

module.exports = Phone;
