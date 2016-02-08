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
const check = (action, expected, inline_check) => {
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
    console.info('********** created message', initiated_id, JSON.stringify(created_message), JSON.stringify(action));

    return Promise.join(
      populateExpectedMessages(expected),
      getAssociatedMessages(initiated_id, expected),
      (processed, action_output) => {
        const actions = parseActions(action_output);

        processed.map((message) => {
          messages[message.key] = message;
        });

        //console.log('actions', actions);
        //console.log('expected', expected);
        const expecteds = parseExpecteds(expected, messages);
        //console.log('expected afterwards', expected);

        if ( inline_check ) {
          //console.log('expecteds', expecteds);
          return inlineCheck(actions, expecteds);
        } else {
          return {
            output: actions,
            expected: expecteds
          };
        }
      }
    );
  });
};

const populateExpectedMessages = (expected) => {
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

const requestAssociatedMessages = (initiated_id, resolve, expected) => {
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

    // if we have actual expectations, we only
    // want to return messages matching our initiator_id.
    // If we get back an empty array, we assume
    // our messages have yet to be processed
    if ( expected.length ) {
      if (body.length > 0) {
        resolve(body);
      }
    } else {
      // However, if we do not have any expectations,
      // we expect to receive no messages. Therefore,
      // on ping back, we should expect that no messages
      // are waiting for us.
      resolve(body);
    }
  });
}

const getAssociatedMessages = (initiated_id, expected) => {
  const timeout_length = 3000;
  const ping_length = 500;
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

    // only ping the server if we are expecting messages
    if ( expected.length ) {
      ping = setInterval(() => {
        requestAssociatedMessages(initiated_id, res, expected);
      }, ping_length);
    }

    callback = () => {
      requestAssociatedMessages(initiated_id, res, expected);
    };
  });

}
const parseActions = (action_output) => {
  return action_output.map((a) => {
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
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const checkBody = (action, expected) => {
  if ( expected && expected.body ) {
    const expected_body = escapeRegExp(expected.body.replace(/\*/g,'(.*)'));
    const re = new RegExp(expected_body);
    try {
      re.test(action.body);
    } catch(err) {
      // this will fail but we'll get a nice
      // error message out of it
      action.body.should.equal(expected);
    }
  } else {
    // this indicates that we expect no response. Not sure
    // the best way to check for this.
    console.log(action, expected);
    action.should.be(undefined);
  }
}

module.exports = check;
