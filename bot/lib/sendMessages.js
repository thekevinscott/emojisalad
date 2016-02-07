'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
//const queues = require('config/services').queues;
const sendAlert = require('./sendAlert');
const registry = require('microservice-registry');

const sendMessages = (messages, options = {}) => {
  console.info('messages to send', messages);

  if ( options.trip && messages.length >= options.trip ) {
    sendAlert(messages, 'tripped', 'send');
    throw "Tripwire tripped on send, too many messages";
  } else if ( options.alert && messages.length >= options.alert ) {
    sendAlert(messages, 'alert', 'send');
    console.info(`Warning, alert tripped: ${messages.length}`);
  }

  const messages_by_protocol = messages.reduce((obj, message) => {
    if ( ! message.protocol ) {
      throw "Message protocol not provided: " + JSON.stringify(message);
    }
    if ( ! obj[message.protocol] ) {
      obj[message.protocol] = [];
    }
    obj[message.protocol].push(message);
    return obj;
  }, {});

  console.info('messages_by_protocol', messages_by_protocol);
  return Promise.all(Object.keys(messages_by_protocol).map((protocol) => {
    const messages = messages_by_protocol[protocol];
    const service = registry.get(protocol);
    console.info('the messages to send', messages);
    return request({
      url: service.api.send.endpoint,
      method: service.api.send.method,
      form: {
        messages: messages
        //messages: messages.map(function(message) {
          //return {
            //to: message.to,
            //from: message.from,
            //body: message.body,
            //initiated_id: message.initiated_id
          //}
        //})
      }
    });
  }));
};

module.exports = sendMessages;
