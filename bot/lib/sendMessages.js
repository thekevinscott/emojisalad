'use strict';

const Promise = require('bluebird');
const concatenate = require('lib/concatenateMessages');
const request = Promise.promisify(require('request'));
const queues = require('config/services').queues;

const sendMessages = Promise.coroutine(function* (messages) {
  messages = concatenate(messages);
  console.debug('sending messages', messages);

  //if ( process.env.ENVIRONMENT !== 'test' ) {
    yield request({
      url: queues.sms.send,
      method: 'POST',
      form: {
        messages: messages.map(function(message) {
          return {
            to: message.to,
            from: message.from,
            body: message.body 
          }
        })
      }
    });
  //} else {
    //throw "WTF SHOULD NOT HAPPEN";
  //}
});

module.exports = sendMessages;
