'use strict';
const pmx = require('pmx');
const Promise = require('bluebird');

const runTime = 5;

const getMessages = require('lib/getMessages');
const processMessage = require('lib/processMessage');
const sendMessages = require('lib/sendMessages');
const setTimestamp = require('lib/setTimestamp');
const getTimestamp = require('lib/getTimestamp');

let timer;
let queued_read_action = false;
let processing = false;
const allowed_protocols = process.env.PROTOCOLS.split(',');
const tripwire_settings = {
  // if 10 or more messages are gotten or sent,
  // send us an email to let us know
  alert: 10,
  // if 20 or more messages are gotten or sent,
  // throw the tripwire and send us an email to know
  trip: 20
};

const sequential = (fns) => {
  return Promise.reduce(fns, (response, fn) => {
    return fn().then(function(output) {
      return response.concat(output);
    });
  }, []);
}

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
    processing = true;
    //console.debug('read');
    clear();

    //console.debug('get the timestamp');
    //const lastRecordedTimestamp = yield 
    return getTimestamp().then((lastRecordedTimestamp) => {
      //console.debug('got the timestamp');
      if ( ! lastRecordedTimestamp ) {
        throw new Error('No Timestamp found');
      }
      console.debug('lastRecord', lastRecordedTimestamp, new Date(lastRecordedTimestamp * 1000), 'current time', new Date());

      return getMessages(lastRecordedTimestamp, allowed_protocols, tripwire_settings).then((messages) => {
        //console.debug('messages: there hsould be protocol in here', messages);
        //console.debug('got messages', messages.length);

        if ( messages.length ) {
          //console.debug('incoming message length', messages.length);

          return sequential(messages.map((message) => {
            return function() {
              return processMessage(message);
            }
          })).then((processed_messages) => {
            //console.debug('processed messages', processed_messages);
            //console.debug('****** MAKE SURE THESE ARENT ON THE OBJECT');
          //return Promise.all(messages.map(processMessage)).then((processed_messages) => {
            //console.debug('this should be an array of an array of messages', processed_messages);

            // set timestamp once we've retrieved the messages and processed them,
            // but before we've sent them.
            //
            // The logic here is that, if there is some error with sending and some
            // of the messages go out but not all of them, we don't want to 
            // resend out potentially invalid messages, which could happen if we don't
            // accurately record the timestamp.
            //console.debug('set Timestamp for messages');
            return setTimestamp(messages).then(() => {
              //console.debug('prepare to send messages');

              return sendMessages(processed_messages).then(() => {
                //console.debug('messages are sent');
                processing = false;
                if ( queued_read_action ) {
                  read();
                } else {
                  timer = setTimeout(read, runTime*1000);
                }
              });
            });
          });
        }
      });
    }).catch((err) => {
      console.error(err.stack);
      pmx.notify(err);
      if ( timer ) {
        clearTimeout(timer);
      }
      processing = false;
      if ( queued_read_action ) {
        read();
      }
      throw err;
    });
  } else {
    queued_read_action = true;
    return new Promise((resolve) => {
      resolve();
    });
  }
};

function clear() {
}

module.exports = read;
