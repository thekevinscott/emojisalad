'use strict';
const Promise = require('bluebird');
const Message = require('models/message');
const Twilio = require('models/twilio');
const store = require('store');
const queues = require('config/services').queues;
const lodash = require('lodash');

const request = Promise.promisify(require('request'));

const runTime = 30;

const getMessages = require('lib/getMessages');
const processMessage = require('lib/processMessage');
const sendMessages = require('lib/sendMessages');
const setTimestamp = require('lib/setTimestamp');

let timer;

let main = Promise.coroutine(function* (req, res) {
  try {
    console.debug('main');
    clear();

    const lastRecordedTimestamp = yield store('timestamp');

    console.debug('lastRecord', lastRecordedTimestamp);

    const messages = yield getMessages(lastRecordedTimestamp);
    console.debug('messages', messages);

    if ( messages.length ) {
      console.debug('set Timestamp messages', messages);

      const processed_messages = yield Promise.all(messages.map(processMessage));
      console.debug('this should be an array of messages', processed_messages);

      // set timestamp once we've retrieved the messages and processed them,
      // but before we've sent them.
      //
      // The logic here is that, if there is some error with sending and some
      // of the messages go out but not all of them, we don't want to 
      // resend out potentially invalid messages, which could happen if we don't
      // accurately record the timestamp.
      yield setTimestamp(messages);

      yield sendMessages(processed_messages);
      //if ( process.env.ENVIRONMENT !== 'test' ) {
        timer = setTimeout(main, runTime*1000);
      //}
    }

    if ( res ) {
      res.end();
    }
  } catch(err) {
    console.error(err);
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
