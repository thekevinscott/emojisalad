var Promise = require('bluebird');
var setup = require('./setup');
var _ = require('lodash');
var Message = require('../../../../models/Message');
var expect = require('chai').expect;

// checks that a certain action's
// return matches an expected array
var check = function(action, expected) {
  var fns = [setup(action)];
  var message_keys = _.uniq(expected.map(function(e) {
    return e.key;
  }));
  var messages = {};
  // retreive messages
  var expected_fns = expected.map(function(message) {
    if ( ! messages[message.key] ) {
      messages[message.key] = true;
      return message;
    }
  }).filter(function(el) {
    return el;
  }).map(function(message) {
    return Message.get([message.key], message.options);
  });
  fns = fns.concat(expected_fns);

  return Promise.all(fns).then(function(responses) {
    // our initial action
    var action_output = responses.shift()[0].Response.Sms;
    responses.map(function(message) {
      messages[message.key] = message;
    });

    var actions = [];
    for ( var i=0;i<action_output.length;i++ ) {
      var action = {
        message : action_output[i]['_']
      };
      if ( action_output[i]['$'] ) {
        action.recipient = action_output[i]['$']['to'];
      }
      actions.push(action);
    }

    var expecteds = [];
    for ( var i=0;i<expected.length;i++ ) {
      var expected_obj = {
        message : messages[expected[i].key].message
      };
      if ( expected[i].to ) {
        expected_obj.recipient = expected[i].to.number;
      }
      expecteds.push(expected_obj);
    }

    // we return arrays of expectations so that tests can accurately report 
    // line numbers for errors.
    return {
      output: actions,
      expected: expecteds
    };
  });

};

module.exports = check;
