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
const setup = require('./setup');
const Message = require('models/Message');
const xml2js = Promise.promisifyAll(require('xml2js')).parseStringAsync; // example: xml2js 
const levenshtein = require('levenshtein');
const services = require('config/services');
const chalk = require('chalk');
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
const check = Promise.coroutine(function* (action, expected, inline_check) {
  // this is the id of the initiating message;
  // we'll use this to get back the associated messages to check against
  let initiated_id;
  return setup(action).then((created_messages) => {
    const created_message = created_messages.shift();
    if ( ! created_message.id ) {
      console.error('********** created message', JSON.stringify(created_messages), JSON.stringify(action));
      throw new Error('No message id provided');
    }
    initiated_id = created_message.id;
    console.log(chalk.blue('********** created message', initiated_id, JSON.stringify(created_message), JSON.stringify(action)));

    return Promise.join(
      populateExpectedMessages(expected),
      getAssociatedMessages(initiated_id),
      (processed, action_output) => {
        const actions = parseActions(action_output);

        processed.map(function(message) {
          messages[message.key] = message;
        });

        const expecteds = parseExpecteds(expected, messages);

        if ( inline_check ) {
          inlineCheck(actions, expecteds);
        } else {
          return {
            output: actions,
            expected: expecteds
          };
        }
      }
    );
  });
});

const populateExpectedMessages = (expected) => {
  return Promise.all(expected.map(function(message) {
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
  }));
}

const requestAssociatedMessages = (initiated_id, resolve) => {
  const url = `http://localhost:${port}/sent`;
  return request({
    url: url,
    method: 'get',
    qs: {
      initiated_id: initiated_id
    }
  }).then((res) => {
    let body = res.body;
    try {
      body = JSON.parse(body);
    } catch(err) {}

    if (body.length > 0) {
      resolve(body);
    }
  });
}

const getAssociatedMessages = (initiated_id) => {
  const timeout_length = 10000;
  const ping_length = 9000;
  let timer;
  let ping;
  return new Promise((resolve, reject) => {
    const res = (body) => {
      clearTimeout(timer);
      clearInterval(ping);
      callback = noop;
      resolve(body);
    }
    setTimeout(() => {
      callback = noop;
      reject(`No message response within ${timeout_length/1000} seconds`);
    }, timeout_length);
    ping = setInterval(() => {
      requestAssociatedMessages(initiated_id, res);
    }, ping_length);
    callback = () => {
      requestAssociatedMessages(initiated_id, res);
    };
  });

}
const parseActions = (action_output) => {
  return action_output.map(function(a) {
    let action = {
      body : a.body
    };
    if ( a.to ) {
      action.recipient = a.to;
    }
    return action;
  });
}

const parseExpecteds = (expected, messages) => {
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
  return expecteds;
}

const inlineCheck = (actions, expecteds) => {
  actions.map((action, i) => {
    return checker(action, expecteds[i]);
  });

  actions.map((action) => {
    delete action.body;
    return action;
  }).should.deep.equal(expecteds.map((expected) => {
    delete expected.body;
    return expected;
  }));
};


const checkBody = (action, expected) => {
  expected = expected.body.replace(/\*/g,'');
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
}

module.exports = check;
