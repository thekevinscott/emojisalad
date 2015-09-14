'use strict';
//var Promise = require('bluebird');
var req = require('./req');
var sequence = require('./sequence');
var _ = require('lodash');

var setup = function(arr) {
  if ( !_.isArray(arr) ) {
    arr = [arr];
  }

  return sequence(arr.map(function(a, i) {
    var user = a.user;
    var msg = a.msg;
    if ( ! user ) {
      console.error(a, i);
      throw "No user provided";
    }
    if ( ! msg ) {
      console.error(a, i);
      throw "No msg provided";
    }
    return function() {
      return req.post({
        user: user,
        message: msg
      }, null, true);
    };
  }));
};

module.exports = setup;
