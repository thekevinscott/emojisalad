'use strict';
const Promise = require('bluebird');
const twilio2 = require('./platforms/twilio2');
const Message = require('models/message');
const Twilio = require('models/twilio');
const store = require('store');
const queues = require('config/services').queues;

const request = Promise.promisify(require('request'));

const runTime = 30;

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
  return messages;
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

  let messages = yield getMessages(lastRecordedTimestamp);
  console.debug('messages', messages);

  if ( messages.length ) {
    // make a note of the last messages timestamp
    let lastMessageTimestamp = messages[messages.length-1].timestamp;
    console.debug('last message timestamp', lastMessageTimestamp);
    yield store('timestamp', lastMessageTimestamp);

    console.debug('messages from store', messages);

    yield Promise.all(messages.map(handle)).then(function(processed_messages) {
      return sendMessages(processed_messages);
    }).then(function(msg) {
      if ( process.env.ENVIRONMENT !== 'test' ) {
        timer = setTimeout(main, runTime*1000);
      }
      return msg;
    });
  }

  if ( res ) {
    res.end();
  }
});

const concatenate = function(responses) {
  let tos = {};
  for ( var i=0; i<responses.length; i++ ) {
    let response = responses[i];
    console.debug('response', response);
    let to = response.to;
    if ( !tos[to] ) {
      tos[to] = [];
    }
    tos[to].push(response);
  }
  console.debug('tos', tos);
  let newResponses = Object.keys(tos).map(function(to) {
    return tos[to].reduce(function(output, response) {
      if (! output) {
        output = {
          to: response.to,
          from: response.from,
          message: [response.message]
        };
      } else {
        output.message.push(response.message);
      }
      return output;
    }, null);
  }).map(function(response) {
    response.message = response.message.join('\n\n');
    return response;
  });

  return newResponses;
};

let sendMessages = Promise.coroutine(function* (messages) {
  messages = concatenate(messages);
  console.debug('sending messages', messages);

  if ( process.env.ENVIRONMENT !== 'test' ) {
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
  } else {
    throw "WTF SHOULD NOT HAPPEN";
  }
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
module.exports.handle = handle;
