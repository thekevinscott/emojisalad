/**
 * Setup is a convenience function used for various tests.
 *
 * It's basically a shorthand of providing an array of messages
 * to be sent out as requests to a particular queue (in
 * this case, testqueue) in a sequential order.
 *
 * It returns a promise indicating whether or not
 * all messages are sent successfully or not. The promise
 * will not contain any return data; that would come later.
 *
 */
'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
//const req = require('./req');
const _ = require('lodash');
const sequence = require('./sequence');

const services = require('config/services');
const port = services.testqueue.port;

const noop = () => {};
let callback = noop;
const app = require('./server');
app.post('/', (res) => {
  callback(res);
});

const requestAssociatedMessages = (initiated_id, resolve, expected = false, expected_length = 0) => {
  const url = `http://localhost:${port}/sent`;
  return request({
    url,
    method: 'get',
    qs: {
      initiated_id
    }
  }).then((res) => {
    let body = res.body;
    try {
      body = JSON.parse(body);
    } catch (err) {
      // do nothing
    }

    // if we have actual expectations, we only
    // want to return messages matching our initiator_id.
    // If we get back an empty array, we assume
    // our messages have yet to be processed
    if ( expected ) {
      if ( ! expected_length ) {
        console.error('please provide an expected length');
      }
      //console.log('we are expecting id', initiated_id, 'body length', body.length, 'expected', expected_length);
      if (body.length > 0 && body.length === expected_length) {
        //console.log('found it', body);
        resolve(body);
      }
    } else {
      // However, if we do not have any expectations,
      // we expect to receive no messages. Therefore,
      // on ping back, we should expect that no messages
      // are waiting for us.
      //console.log('we have no expectations');
      resolve(body);
    }
  });
};

const getAssociatedMessages = (initiated_id, expected = false, expected_length = 0) => {
  const timeout_length = 20000;
  const ping_length = 1000;
  let timer;
  let ping;
  return new Promise((resolve, reject) => {
    const res = (body) => {
      clearTimeout(timer);
      clearInterval(ping);
      callback = noop;
      resolve(body);
    };
    setTimeout(() => {
      callback = noop;
      reject(`No message response within ${timeout_length/1000} seconds for id ${initiated_id}`);
    }, timeout_length);

    // only ping the server if we are expecting messages
    if ( expected ) {
      ping = setInterval(() => {
        //console.log('*** get associated messages', initiated_id);
        requestAssociatedMessages(initiated_id, res, expected, expected_length);
      }, ping_length);
    }

    callback = () => {
      requestAssociatedMessages(initiated_id, res, expected, expected_length);
    };
  });
};


const setup = (arr, expected_length) => {
  if ( !_.isArray(arr) ) {
    arr = [arr];
  }

  const fns = arr.map((a, i) => {
    const player = a.player;
    const msg = a.msg;
    const get_response = a.get_response;
    const expect_response = !(a.expect_response === false);
    //const expect_response = (a.expect_response === false) ? false : true;
    try {
      if ( ! player.to && ! a.to ) {
        console.error('a', a, 'i', i);
        throw new Error("Now you must provide an explicit to");
      }
    } catch (err) {
      console.error('error with player', err, a);
    }
    //const to = a.to || game_numbers[0];
    const to = a.to || player.to;
    if ( ! player ) {
      console.error(a, i);
      throw new Error("No player provided");
    }
    if ( ! msg ) {
      console.error('index', i, 'array', arr);
      throw new Error("No msg provided");
    }
    return () => {
      const message = {
        body: msg,
        to: to || player.to,
        from: player.number || player.from
      };

      //console.log(message);
      const url = `http://localhost:${port}/receive`;

      return request({
        url,
        method: 'post',
        form: message
      }).then((res) => {
        if ( res && res.body ) {
          let body = res.body;
          try {
            body = JSON.parse(body);
          } catch (err) {
            // whatevs
          }

          if ( get_response ) {
            return getAssociatedMessages(body.id, expect_response, expected_length).then((messages) => {
              //console.log('m', messages.length, expected_length);
              if ( messages.length && messages.length === expected_length ) {
                //console.log('we got the messages back', messages.length);
                return {
                  initiated_id: messages[0].initiated_id,
                  messages: messages.map(msgToModify => {
                    delete msgToModify.initiated_id;
                    return msgToModify;
                  })
                };
              } else {
                return null;
              }
            });
          } else {
            return {
              initiated_id: body.id
            };
          }
        }
      }).catch((err) => {
        console.error(err);
      });
    };
  });
  return sequence(fns);
};

module.exports = setup;
module.exports.getAssociatedMessages = getAssociatedMessages;
