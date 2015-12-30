'use strict';
const Promise = require('bluebird');
const queues = require('config/services').queues;
const twilio2 = require('./platforms/twilio2');
const Message = require('models/message');
const Twilio = require('models/twilio');
const store = require('store');

const request = Promise.promisify(require('request'));

let timer;

let handle = Promise.coroutine(function* (message) {
  let params = {
    from: message.from,
    to: message.to,
    body: message.body,
  };
  //console.debug('params', params);
  let response = yield twilio2(params);
  let messages = yield Message.parse(response);
  yield sendMessages(messages);
  let twiml = yield Twilio.parse(messages);
  return twiml.toString();
});

let main = Promise.coroutine(function* (req, res) {
  console.debug('main');
  if ( timer ) {
    clearTimeout(timer);
  }

  let lastRecordedTimestamp = yield store('timestamp');


  console.debug('lastRecord', lastRecordedTimestamp);

  let messages = yield getMessages(lastRecordedTimestamp);
  console.debug('messagess', messages);

  if ( messages.length ) {
    // make a note of the last messages timestamp
    let lastMessageTimestamp = messages[messages.length-1].timestamp;
    console.debug('last message timestamp', lastMessageTimestamp);
    yield store('timestamp', lastMessageTimestamp);


    yield Promise.all(messages.map(handle)).then(function(processed_messages) {
      if ( process.env.ENVIRONMENT !== 'test' ) {
        timer = setTimeout(main, 10*1000);
      }
      return processed_messages;
    });
  }

  if ( res ) {
    res.end();
  }
});

let sendMessages = Promise.coroutine(function* (messages) {
  yield request({
    url: queues.sms.send,
    method: 'POST',
    form: {
      messages: messages.map(function(message) {
        return {
          to: message.to,
          from: message.from,
          body: message.message 
        }
      })
    }
  });
});

let getMessages = Promise.coroutine(function* (timestamp) {
  const response = yield request({
    url: queues.sms.received,
    method: 'GET',
    qs: {
      date: timestamp
    }
  });

  let body = response.body;

  try {
    body = JSON.parse(body);
  } catch(err) {} // if err, already parsed

  return body;
});

module.exports = main;
