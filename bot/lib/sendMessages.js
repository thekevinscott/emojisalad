'use strict';

const Promise = require('bluebird');
const concatenateMessages = require('lib/concatenateMessages');

const sendMessages = Promise.coroutine(function* (messages) {
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

module.exports = sendMessages;
