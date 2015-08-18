var User = require('../models/user');
var rp = require('request-promise');
var _ = require('lodash');
var Q = require('q');
var sprintf = require('sprintf');

var script = require('./config');

var methods = require('./methods');

module.exports = function(user, message, res) {
  var dfd = Q.defer();
  console.log('the scripter');
  var message_key = user.state;
  console.log('message_key', message_key);
  if ( script[message_key] ) {
    var scenarios = script[message_key];
    processScenarios(scenarios, message, user);
  }
  dfd.resolve('huh');
  return dfd.promise;
};
