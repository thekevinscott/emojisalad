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

let handle = Promise.coroutine(function* (message) {
  return yield processMessage(message);
});

let main = Promise.coroutine(function* (req, res) {
  console.debug('main');
  if ( timer ) {
    clearTimeout(timer);
  }

  let lastRecordedTimestamp = yield store('timestamp');
  let previousRunTime = (new Date()).getTime()/1000 - runTime;
  if ( lastRecordedTimestamp < previousRunTime ) {
    lastRecordedTimestamp = previousRunTime;
  }

  console.debug('lastRecord', lastRecordedTimestamp);

  const messages = yield getMessages(lastRecordedTimestamp);
  console.debug('messages', messages);

  if ( messages.length ) {
    setTimestamp(messages);

    console.debug('messages from mongo', messages);

    let processed_messages = Promise.all(messages.map(processMessage));
    processed_messages = _.flatten(processed_messages)
    console.debug('this should be an array of messages', processed_messages);
    yield sendMessages(processed_messages);
    if ( process.env.ENVIRONMENT !== 'test' ) {
      timer = setTimeout(main, runTime*1000);
    }
  }

  if ( res ) {
    res.end();
  }
});



module.exports = main;
