'use strict';
const chai = require('chai');
const expect = chai.expect;
const Promise = require('bluebird');
const setup = require('./setup');
const Message = require('models/Message');
const Twilio = require('models/Twilio');
const xml2js = Promise.promisifyAll(require('xml2js')).parseStringAsync; // example: xml2js 
const levenshtein = require('levenshtein');


// checks that a certain action's
// return matches an expected array
let check = Promise.coroutine(function* (action, expected, inline_check) {
  let fns = [setup(action)];
  let messages = {};
  // retreive messages
  let expected_fns = expected.map(function(message) {
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
  const action_output = processed.shift();

  const actions = action_output.map(function(a) {
    let action = {
      body : a.body
    };
    if ( a.to ) {
      action.recipient = a.to;
    }
    return action;
  });

  //let responses = processed[0];
  processed.map(function(message) {
    messages[message.key] = message;
  });
  let expecteds = [];
  if ( expected.length ) {
    for ( let i=0;i<expected.length;i++ ) {
      let expected_obj = {
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
  if ( inline_check ) {
    actions.map((action, i) => {
      const expected = expecteds[i].body.replace(/\*/g,'');
      // we can't use this because of emojis and regex
      //const result = action.body.match(new RegExp(expected));
      try {
        const r = levenshtein(expected, action.body) / action.body.length;
        r.should.be.below(0.05);
      } catch(err) {
        //console.error(err);
        // this will fail but we'll get a nice
        // error message out of it
        action.body.should.equal(expected);
      }
    });

    actions.map((action) => {
      delete action.body;
      return action;
    }).should.deep.equal(expecteds.map((expected) => {
      delete expected.body;
      return expected;
    }));

  } else {
    return {
      output: actions,
      expected: expecteds
    };
  }
});

module.exports = check;
