var Promise = require('bluebird');
var config = require('./config');
var mapScenarios = require('./mapScenarios');

module.exports = function(key, user, message) {
  //var message_key = user.state;
  if ( config[key] ) {
    var data = {
      user: user,
      incomingPattern: message
    }
    return mapScenarios.call(null, config[key], data);
  } else {
    return Promise.reject({
      message: 'No config element found for message key: ' + key
    });
  }
};

module.exports.config = config;
