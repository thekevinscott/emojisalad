var User = require('../../models/user');
var Text = require('../../models/text');
var Message = require('../../models/message');
var _ = require('lodash');
var sprintf = require('sprintf');

/*
 * SMS takes a scenario, a user, and a text message
 * for a user and sends a message to that user.
 *
 */
function sms(scenario, data) {
  console.log('**** sms');
  var user = data.args[0].user;
  var message = data.args[0].pattern;
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

  console.log('**** sms 2');
  if ( scenario.options ) {
    var options = scenario.options.map(function(option) {
      console.log('data', data);
      //console.log('option', option, data.args[0]);
      //var optionParams = {
        //user: data.args[0].user,
        //message: data.args[0].pattern 
      //}
      console.log('option', option, data);
      return sprintf(option, data);
    });
  } else {
    var options = [];
  }

  console.log('what is options here', data.args[1].pattern);
  return Message.get(key, options).then(function(result) {
    return _.assign({}, result, {number: sprintf(scenario.to, data) });
  });
};

module.exports = sms;
