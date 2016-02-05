'use strict';

const Promise = require('bluebird');
const concatenate = require('lib/concatenateMessages');
const request = Promise.promisify(require('request'));
//const queues = require('config/services').queues;
const sendAlert = require('./sendAlert');
const services = require('../services');

const sendMessages = (messages, options = {}) => {
  messages = concatenate(messages);
  console.debug('sending messages', messages);

  if ( options.trip && messages.length >= options.trip ) {
    sendAlert(messages, 'tripped', 'send');
    throw "Tripwire tripped on send, too many messages";
  } else if ( options.alert && messages.length >= options.alert ) {
    sendAlert(messages, 'alert', 'send');
    console.debug(`Warning, alert tripped: ${messages.length}`);
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
  return Promise.all(Object.keys(messages_by_protocol).map((protocol) => {
    const messages = messages_by_protocol[protocol];
    return services.get(protocol).then((service) => {
      return request({
        url: service.endpoints.send.url,
        method: service.endpoints.send.method,
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
    });
  }));
};

module.exports = sendMessages;
