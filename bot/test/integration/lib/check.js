'use strict';
const Promise = require('bluebird');
const setup = require('./setup');
const Message = require('models/Message');
const Twilio = require('models/Twilio');
const xml2js = Promise.promisifyAll(require('xml2js')).parseStringAsync; // example: xml2js 


// checks that a certain action's
// return matches an expected array
var check = Promise.coroutine(function* (action, expected) {
  var fns = [setup(action)];
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
    let options = {};
    options[message.key] = message.options;
    return Message.get([message.key], options).then(function(msg) {
      return msg[0];
    });
    //return Message.get([message.key], message.options);
  });
  fns = fns.concat(expected_fns);

  const processed = yield Promise.all(fns);
  console.log('processed', processed);
  const action_output = processed.shift();

  const actions = action_output.map(function(a) {
    console.log('a', a);
    let action = {
      body : a.body
    };
    if ( a.to ) {
      action.recipient = a.to;
    }
    return action;
  });

  //var responses = processed[0];
  processed.map(function(message) {
    messages[message.key] = message;
  });
  var expecteds = [];
  if ( expected.length ) {
    for ( let i=0;i<expected.length;i++ ) {
      var expected_obj = {
        body : messages[expected[i].key].body
      };
      if ( expected[i].to ) {
        expected_obj.recipient = expected[i].to.number;
      }
      expecteds.push(expected_obj);
    }
  }

  // we return arrays of expectations so that tests can accurately report 
  // line numbers for errors.
  return {
    output: actions,
    expected: expecteds
  };

});

module.exports = check;
