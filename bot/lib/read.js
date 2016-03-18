'use strict';
const pmx = require('pmx');
const Promise = require('bluebird');

const runTime = 5;

const getMessages = require('lib/getMessages');
const processMessage = require('lib/processMessage');
const sendMessages = require('lib/sendMessages');
const store = require('store');
const setStore = require('lib/setStore');
//const getTimestamp = require('lib/getTimestamp');

let timer;
//let queued_read_action = false;
let processing = false;
const allowed_protocols = process.env.PROTOCOLS.split(',');
const tripwire_settings = {
  // if 10 or more messages are gotten or sent,
  // send us an email to let us know
  alert: process.env.TRIPWIRE_ALERT || 10,
  // if 20 or more messages are gotten or sent,
  // throw the tripwire and send us an email to know
  trip: process.env.TRIPWIRE_TRIP || 20
};

const callbacks = [];

const sequential = (fns) => {
  return Promise.reduce(fns, (response, fn) => {
    return fn().then((output) => {
      return response.concat(output);
    });
  }, []);
};

// once called, this function will set itself on a timer.
// that timer gets reset (if it exists) on every run;
// this could happen if the script gets pinged by an
// incoming message, and prevents build up of queued scripts.
//
// However, multiple pings could happen at the same time;
// in this case, we want to queue those pings to run
// immediately on complete (but only one ping can get queued up)
const read = () => {
  if ( processing === false ) {
    //console.info('read');
    processing = true;

    return runRead().catch((err) => {
      console.error(err.stack);
      pmx.notify(err);
      if ( timer ) {
        clearTimeout(timer);
      }
      console.info('set processing to false 2');
      throw err;
    }).finally(() => {
      processing = false;
      if ( callbacks.length ) {
        const output_promise_of_read = read();
        while ( callbacks.length ) {
          const callback = callbacks.pop();
          callback(output_promise_of_read);
        }
      } else {
        timer = setTimeout(read, runTime*1000);
      }
    });
  } else {
    return new Promise((resolve) => {
      console.info('read is already processing, queue this for the next go round');
      //queued_read_action = true;
      callbacks.push((promise) => {
        resolve(promise);
      });
    });
  }
};

const getProtocolIDs = () => {
  const protocol_ids = {};
  return Promise.all(allowed_protocols.map((protocol) => {
    return store(`${protocol}_queue_id`).then((id) => {
      if ( ! id ) {
        id = 0;
      }
      protocol_ids[protocol] = id;
    });
  })).then(() => {
    return protocol_ids;
  });
};

const runRead = () => {
  return getProtocolIDs().then((protocol_ids) => {
    return getMessages(protocol_ids, allowed_protocols, tripwire_settings).then((messages) => {
      //console.info('messages returned', messages);
      if ( messages.length ) {
        console.info('got messages', messages.map((message) => {
          return message;
        }));
        return setStore(messages).then(() => {
          console.info('the retrieved messages from the protocol', messages);
          return sequential(messages.map((message) => {
            return () => {
              return processMessage(message);
            };
          })).filter((message) => {
            // remove any undefined messages;
            // we might get these if there's no response,
            // for instance, if a user marks herself
            // as blacklisted.
            return message;
          }).then((processed_messages) => {
            console.info('processed messages', processed_messages.length);
            return sendMessages(processed_messages);
          });
        });
      }
    });
  });
};

module.exports = read;
