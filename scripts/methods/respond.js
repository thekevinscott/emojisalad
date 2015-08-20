var User = require('../../models/user');
var _ = require('lodash');
var sprintf = require('sprintf');

/*
 * Respond takes a scenario, a user, and a text message
 * from a user and sends a message to that user.
 *
 * It grabs the message key from the scenario's message key,
 * and will optionally sprintf replacements based on some rules
 * specified in the options
 *
 */
function respond(scenario, user, messagePassedFromUser, origBody) {
  if ( ! scenario ) {
    throw new Error("You must provide a scenario");
  } else if ( ! scenario.message ) {
    throw new Error("You must provide a scenario message key");
  } else if ( scenario.options && !_.isArray(scenario.options) ) {
    throw new Error("Options must be an array");
  } else if ( ! user ) {
    throw new Error("You must provide a user");
  } else if ( ! user.id ) {
    throw new Error("You must provide a user id");
  }

  var key = scenario.message;

  if ( scenario.options ) {
    var options = scenario.options.map(function(option) {
      var optionParams = {
        user: user,
        message: messagePassedFromUser
      }
      return sprintf(option, optionParams)
    });
  } else {
    var options = [];
  }

  var result = User.message(user, key, options);
  return result;
};

module.exports = respond;