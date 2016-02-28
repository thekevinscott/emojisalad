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
const chai = require('chai');
const expect = chai.expect;
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const setup = require('lib/setup');
const Message = require('models/Message');

const services = require('config/services');
const port = services.testqueue.port;

const noop = () => {};
let callback = noop;
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
    let options = {};
    options[message.key] = message.options;
    return Message.get([message.key], options).then((msg) => {
      return msg[0];
    });
    //return Message.get([message.key], message.options);
  }));
}

const parseActions = (action_output) => {
  if ( action_output && action_output.messages ) {
    return action_output.messages.map((a) => {
      let action = {
        body : a.body
      };
      if ( a.to ) {
        action.recipient = a.to;
      }
      return action;
    });
  } else {
    return [];
  }
}

const parseExpecteds = (expected, messages) => {
  let expecteds = [];
  // first pass, associated messages with a particular expected message
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

  // second pass, conatenate particular expecteds to a particular player
  const concatenated_by_recipient = expecteds.reduce((obj, expected) => {
    const recipient = expected.recipient;
    if ( !obj[recipient] ) {
      obj[recipient] = [];
    }
    obj[recipient].push(expected.body);
    return obj;
  }, {});

  let seen = {};
  return expecteds.map((e) => {
    if ( ! seen[e.recipient] ) {
      seen[e.recipient] = true;
      return e.recipient;
    }
  }).filter(e => e).map((recipient) => {
    const expected_bodies = concatenated_by_recipient[recipient];
    return {
      recipient: recipient,
      body: expected_bodies.join('\n\n')
    };
  });
}

const inlineCheck = (actions, expecteds) => {
  if ( actions.length !== expecteds.length ) {
    // this will throw an error; but it'll indicate exactly
    // what's wrong with our expectations
    actions.should.deep.equal(expecteds);
  }

  actions.map((action, i) => {
    return checkBody(action, expecteds[i]);
  });

  actions.map((action) => {
    delete action.body;
    return action;
  }).should.deep.equal(expecteds.map((expected) => {
    delete expected.body;
    return expected;
  }));
};

const escapeRegExp = (str) => {
  //return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  return str.replace(/\?/g,'\\?')
            .replace(/\+/g,'\\+')
            .replace(/\)/g,'\\)')
            .replace(/\(/g,'\\(');
}


const checkBody = (action, expected) => {
  if ( expected && expected.body ) {
    const expected_body = escapeRegExp(expected.body).replace(/\*/g,'(.*)');
    const re = new RegExp(expected_body);
    const action_body = action.body;

    try {
      if ( ! re.test(action_body) ) {
        throw new Error();
      };
    } catch(err) {
      // this will fail but we'll get a nice
      // error message out of it
      action_body.should.equal(expected.body);
    }
  } else {
    // this indicates that we expect no response. Not sure
    // the best way to check for this.
    action.should.be(undefined);
  }
}

module.exports = check;
