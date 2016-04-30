/**
 * Check will check that a given outgoing message
 * results in a set of expected response messages.
 *
 * It will call setup with a single message, and then
 * spin up a server route to listen for incoming messages.
 *
 * Any time it receives a ping back (indicating a message
 * has been processed and sent out),
 *
 */
'use strict';
//const chai = require('chai');
//const expect = chai.expect;
const Promise = require('bluebird');
//const request = Promise.promisify(require('request'));
const setup = require('lib/setup');
const Message = require('models/Message');
//const game_numbers = require('config/numbers');

//const services = require('config/services');
//const port = services.testqueue.port;

const noop = () => {};
const callback = noop;
const app = require('./server');
app.post('/', (res) => {
  callback(res);
});

const messages = {};

// checks that a certain action's
// return matches an expected array
const check = (action, expected) => {
  // these commands instruct setup to return
  // the associated message id,
  // and if we expect messages, the associated
  // messages
  action.get_response = true;
  action.expect_response = expected.length > 0;
  return setup(action).then((created_messages) => {
    const created_message = created_messages.shift();

    return Promise.join(
      populateExpectedMessages(expected),
      (processed) => {
        const actions = parseActions(created_message);

        if ( expected.length && ! processed.length ) {
          console.error('*** expected', expected);
          console.error('*** processed', processed);
          throw 'wtf, no processed, this probably implies a bug';
        }

        processed.map((message) => {
          messages[message.key] = message;
        });

        const expecteds = parseExpecteds(expected, messages);

        return inlineCheck(actions, expecteds);
      }
    );
  });
};

const populateExpectedMessages = (expected) => {
  const messages = {};
  return Promise.all(expected.map((message) => {
    if ( ! messages[message.key] ) {
      messages[message.key] = true;
      return message;
    }
  }).filter((el) => {
    return el;
  }).map((message) => {
    const options = {};
    options[message.key] = message.options;
    return Message.get([message.key], options).then((msg) => {
      return msg[0];
    });
    //return Message.get([message.key], message.options);
  }));
};

const parseActions = (action_output) => {
  if ( action_output && action_output.messages ) {
    return action_output.messages.map((a) => {
      const action = {
        body: a.body,
        game_number: a.from
      };
      if ( a.to ) {
        action.recipient = a.to;
      }
      return action;
    });
  } else {
    return [];
  }
};

const parseExpecteds = (expected, messages) => {
  let expecteds = [];
  // first pass, associated messages with a particular expected message
  if ( expected.length ) {
    expecteds = expected.map((expected_message) => {
      const expected_obj = {
        //body: messages[expected_message.key].body,
        variants: messages[expected_message.key].variants
      };
      if ( expected_message.to ) {
        expected_obj.recipient = expected_message.to.from || expected_message.to.number;
        expected_obj.game_number = expected_message.from || expected_message.to.to;
      }
      return expected_obj;
    });
  }

  // second pass, conatenate particular expecteds to a particular player
  const concatenated_by_recipient = expecteds.reduce((obj, expected) => {
    const recipient = expected.recipient;
    if ( !obj[recipient] ) {
      //obj[recipient] = { game_number: expected.game_number, body: [], variants: {} };
      obj[recipient] = { game_number: expected.game_number, variants: {} };
    }
    //obj[recipient].body.push(expected.body);
    expected.variants.map((variant, index) => {
      if ( !obj[recipient].variants[index]) {
        obj[recipient].variants[index] = [];
      }
      obj[recipient].variants[index].push(variant);
    });
    return obj;
  }, {});

  const seen = {};
  return expecteds.map((e) => {
    if ( ! seen[e.recipient] ) {
      seen[e.recipient] = true;
      return e.recipient;
    }
  }).filter(e => e).map((recipient) => {
    //const expected_bodies = concatenated_by_recipient[recipient].body;
    const expected_variants = concatenated_by_recipient[recipient].variants;
    const game_number = concatenated_by_recipient[recipient].game_number;
    return {
      recipient,
      game_number,
      //body: expected_bodies.join('\n\n'),
      variants: Object.keys(expected_variants).map((key) => {
        return expected_variants[key].join('\n\n');
      })
    };
  });
};

const inlineCheck = (actions, expecteds) => {
  if ( actions.length !== expecteds.length ) {
    // this will throw an error; but it'll indicate exactly
    // what's wrong with our expectations
    console.error('***** message length mismatch *****');
    console.error('actions', actions);
    console.error('expecteds', expecteds);
    actions.should.deep.equal(expecteds);
  }

  actions.map((action, i) => {
    return checkBody(action, expecteds[i]);
  });

  actions.map((action) => {
    delete action.body;
    return action;
  }).should.deep.equal(expecteds.map((expected) => {
    //delete expected.body;
    delete expected.variants;
    return expected;
  }));
};

const escapeRegExp = (str) => {
  //return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  return str.replace(/\?/g,'\\?')
            .replace(/\+/g,'\\+')
            .replace(/\)/g,'\\)')
            .replace(/\(/g,'\\(');
};

// Checks the action body against the expected variants
const checkBody = (action, expected) => {
  if ( expected && expected.variants ) {
    const action_body = action.body;
    try {
      let match = false;

      expected.variants.map((variant) => {
        const expected_variant = escapeRegExp(variant).replace(/\*/g,'(.*)');
        const re = new RegExp(expected_variant);

        if ( re.test(action_body) ) {
          match = true;
        };
      });
      if ( ! match ) {
        throw new Error();
      }
    } catch(err) {
      console.error('***** error found *****');
      console.error(action, expected);
      // this will fail but we'll get a nice
      // error message out of it
      action_body.should.equal(expected.variants);
    }
  } else {
    // this indicates that we expect no response. Not sure
    // the best way to check for this.
    action.should.be(undefined);
  }
};

module.exports = check;
