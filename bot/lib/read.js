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
  alert: process.env.TRIPWIRE_ALERT || 10,
  // if 20 or more messages are gotten or sent,
  // throw the tripwire and send us an email to know
  trip: process.env.TRIPWIRE_TRIP || 20
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
  console.info('read function, processing: ', processing);
  if ( processing === false ) {
    //console.info('set processing to true');
    processing = true;
    clear();

    //const lastRecordedTimestamp = yield 
    return getTimestamp().then((lastRecordedTimestamp) => {
      if ( ! lastRecordedTimestamp ) {
        throw new Error('No Timestamp found');
      }
      console.info('lastRecord', lastRecordedTimestamp, new Date(lastRecordedTimestamp * 1000), 'current time', new Date());
      console.info('get messages');
      return getMessages(lastRecordedTimestamp, allowed_protocols, tripwire_settings).then((messages) => {
        console.info('set Timestamp for messages');
        return setTimestamp(messages).then(() => {

          console.info('messages length', messages);

          if ( messages.length ) {

            console.info('messages', messages);
            return sequential(messages.map((message) => {
              return () => {
                return processMessage(message);
              }
            })).filter((message) => {
              // remove any undefined messages;
              // we might get these if there's no response,
              // for instance, if a user marks herself 
              // as blacklisted.
              return message;
            }).then((processed_messages) => {
              //})).then((processed_messages) => {
              console.info('processed messages', processed_messages);

              console.info('prepare to send messages');

              return sendMessages(processed_messages).then(() => {
                console.info('messages are sent');
                console.info('set processing ot false');
                processing = false;
                if ( queued_read_action ) {
                  read();
                } else {
                  timer = setTimeout(read, runTime*1000);
                }
              });
            });
          } else {
            console.info('set processing to false, 3');
            processing = false;
            timer = setTimeout(read, runTime*1000);
          }
        });
      });
    }).catch((err) => {
      console.error(err.stack);
      pmx.notify(err);
      if ( timer ) {
        clearTimeout(timer);
      }
      console.info('set processing to false 2');
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
