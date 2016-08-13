'use strict';
const pmx = require('pmx');
const Promise = require('bluebird');
const _ = require('lodash');

const runTime = 5;

const Timer = require('models/timer');
const getMessages = require('lib/getMessages');
const getWebSubmissions = require('lib/getWebSubmissions');
const processMessage = require('lib/processMessage');
const processWebMessage = require('lib/processWebMessage');
const sendMessages = require('lib/sendMessages');
const store = require('store');
const setStore = require('lib/setStore');
//const getTimestamp = require('lib/getTimestamp');

let timer;
//let queued_read_action = false;
let processing = false;
const PROTOCOLS = process.env.PROTOCOLS.split(',');
const tripwire_settings = {
  // if 10 or more messages are gotten or sent,
  // send us an email to let us know
  alert: process.env.TRIPWIRE_ALERT || 10,
  // if 20 or more messages are gotten or sent,
  // throw the tripwire and send us an email to know
  trip: process.env.TRIPWIRE_TRIP || 20
};

let callbacks = [];

const sequential = (fns) => {
  return Promise.reduce(fns, (response, fn) => {
    return fn().then((output) => {
      return response.concat(output);
    });
  }, []);
};

const getLastProtocolMessageIDs = (allowed_protocols) => {
  const last_protocol_message_ids = {};
  return Promise.all(allowed_protocols.map((protocol) => {
    return store(`${protocol}_queue_id`).then((id) => {
      if ( ! id ) {
        id = 0;
      }
      last_protocol_message_ids[protocol] = id;
    });
  })).then(() => {
    return last_protocol_message_ids;
  });
};

const runRead = () => {
  //console.info('run read 1');
  return getLastProtocolMessageIDs(PROTOCOLS).then((last_protocol_message_ids) => {
    //console.info('run read 2');
    return getMessages(last_protocol_message_ids, PROTOCOLS, tripwire_settings);
  }).then((messages) => {
    //console.info('run read 3');
    if ( messages.length ) {
      //console.info('got messages', messages.map((message) => {
        //return message;
      //}));
      return setStore(messages).then(() => {
        //console.info('the retrieved messages from the protocol', messages);
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
          //console.info('processed messages', processed_messages.length);
          return sendMessages(processed_messages);
        });
      });
    }
  }).then(() => {
    //console.info('run read 4');
    // process any outstanding timers
    return Timer.get().then((timers) => {
      if (timers.length) {
        //console.info('timers to process', timers);
        const timer_messages = timers.reduce((messages, t) => {
          return messages.concat(t.messages);
        }, []);

        //console.info('timer messages', timer_messages);
        return sendMessages(timer_messages).then(() => {
          const timer_keys = _.uniq(timers.map(t => t.key));
          const timer_game_ids = _.uniq(timers.map(t => t.game_id));
          return Timer.use(timer_keys, timer_game_ids);
          //return timers;
        }).catch(err => {
          console.log('some err!', err);
        });
      }
    });
  }).then(() => {
    //console.info('run read 5');
    return getLastProtocolMessageIDs(['web']).then(last_protocol_message_ids => {
      return getWebSubmissions(last_protocol_message_ids);
    }).then(responses => {
      if (responses && responses.length > 0) {
        const key = 'web_queue_id';
        const message_id = responses[responses.length - 1].id;
        return store(key, message_id).then(() => {
          return Promise.all(responses.reduce((messages, response) => {
            return processWebMessage(response).then(output => {
              if (output) {
                return messages.concat(output);
              } else {
                return messages;
              }
            });
          }, []));
        }).then(messages => {
          //console.info('messages', messages);
          return sendMessages(messages);
        });
      }
    });
  });
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
  //console.info('read called');
  if ( processing === false ) {
    //console.log('process read');
    //console.info('read');
    processing = true;

    return runRead().then(() => {
      //console.info('run read is complete');
    }).catch((err) => {
      //console.log('error with read');
      console.error(err.stack);
      pmx.notify(err);
      if ( timer ) {
        clearTimeout(timer);
      }
      //console.info('set processing to false 2');
      throw err;
    }).finally(() => {
      //console.info('done with read');
      //console.info('done with read', callbacks.length);
      processing = false;
      if ( callbacks.length ) {
        //console.log('immediately do anotehr read');
        const callbacks_to_process = callbacks;
        callbacks = [];
        return read().then((output_promise_of_read) => {
          callbacks_to_process.map((callback) => {
            callback(output_promise_of_read);
          });
        });
      } else {
        //console.log('no clalbacks, let it sit');
        timer = setTimeout(read, runTime*1000);
      }
    });
  } else {
    //console.info('do not process read (yet)');
    return new Promise((resolve) => {
      const key = Math.random();
      //console.info('read is already processing, queue this for the next go round', key);
      //queued_read_action = true;
      callbacks.push((promise) => {
        //console.info('processed waiting read!', key);
        resolve(promise);
      });
    });
  }
};

module.exports = read;
