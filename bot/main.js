'use strict';
const pmx = require('pmx');
const Promise = require('bluebird');
const Message = require('models/message');
const Twilio = require('models/twilio');
const store = require('store');
const queues = require('config/services').queues;
const lodash = require('lodash');

const request = Promise.promisify(require('request'));

const runTime = 5;

const getMessages = require('lib/getMessages');
const processMessage = require('lib/processMessage');
const sendMessages = require('lib/sendMessages');
const setTimestamp = require('lib/setTimestamp');
const getTimestamp = require('lib/getTimestamp');

let timer;

let main = Promise.coroutine(function* (req, res) {
  try {
    console.debug('main');
    clear();

    const lastRecordedSMSTimestamp = yield getTimestamp(runTime);
    if ( ! lastRecordedSMSTimestamp ) {
      throw new Error('No Timestamp found');
    }
    console.debug('lastRecord', lastRecordedSMSTimestamp);

    const messages = yield getMessages(lastRecordedSMSTimestamp);
    //console.debug('got messages', messages);

    if ( messages.length ) {
      const processed_messages = yield Promise.all(messages.map(processMessage));
      //console.debug('this should be an array of an array of messages', processed_messages);

      // set timestamp once we've retrieved the messages and processed them,
      // but before we've sent them.
      //
      // The logic here is that, if there is some error with sending and some
      // of the messages go out but not all of them, we don't want to 
      // resend out potentially invalid messages, which could happen if we don't
      // accurately record the timestamp.
      console.debug('set Timestamp for messages');
      yield setTimestamp(messages);

      yield Promise.all(processed_messages.map(function(messages_to_send) {
        return sendMessages(messages_to_send);
      }));

      timer = setTimeout(main, runTime*1000);
    }

    if ( res ) {
      res.end();
    }
  } catch(err) {
    console.error(err);
    pmx.notify(err);
    clear();
    throw err;
  }
});

function clear() {
  if ( timer ) {
    clearTimeout(timer);
  }
}

module.exports = main;
