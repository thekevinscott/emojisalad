'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
//const queues = require('config/services').queues;
const sendAlert = require('./sendAlert');
const registry = require('microservice-registry');

function sequence(tasks) {
  return tasks.reduce((current, task) => {
    return current.then(task);
  }, Promise.cast());
}

function getGroupedMessages(messages) {
  const grouping = 5;
  const groupedMessages = [];
  for (let i = 0; i < Math.ceil(messages.length / grouping); i++) {
    const start = i * grouping;
    groupedMessages.push(messages.slice(start, start + grouping));
  }
  return groupedMessages;
}

function hasBodyError(options, body, byteLength) {
  try {
    // if its not JSON, its probably an error
    JSON.parse(body);
  } catch (err) {
    if (body.indexOf('Error: request entity too large') !== -1) {
      throw new Error('Request too large: ' + byteLength);
    } else if (body.indexOf('PayloadTooLargeError') !== -1) {
      console.info(options, body);
      throw new Error('Payload Too Large Error: ' + byteLength);
    }

    console.info('unknown error', body);
    console.error('unknown error', body);
    throw new Error('Unknown error: ' + byteLength + ' ' + body);
  }
  return true;
}

const sendMessages = (messages = [], options = {}) => {
  //console.info('send 1');
  console.info('messages to send', messages);

  if ( options.trip && messages.length >= options.trip ) {
    sendAlert(messages, 'tripped', 'send');
    throw new Error("Tripwire tripped on send, too many messages");
  } else if ( options.alert && messages.length >= options.alert ) {
    sendAlert(messages, 'alert', 'send');
    console.info(`Warning, alert tripped: ${messages.length}`);
  }

  const messages_by_protocol = messages.reduce((obj, message) => {
    console.log('message', message);
    if ( ! message.protocol ) {
      throw new Error("Message protocol not provided: " + JSON.stringify(message));
    }
    if ( ! obj[message.protocol] ) {
      obj[message.protocol] = [];
    }
    obj[message.protocol].push(message);
    return obj;
  }, {});

  //console.info('messages_by_protocol', messages_by_protocol);
  console.info('send 2');
  return Promise.all(Object.keys(messages_by_protocol).map((protocol) => {
    console.info('send 3', protocol);
    console.info('protocol', protocol);
    const protocolMessages = messages_by_protocol[protocol];
    const service = registry.get(protocol);
    //console.info('service', service);
    const requestOptions = {
      url: service.api.send.endpoint,
      method: service.api.send.method,
      form: {
        messages: JSON.stringify(protocolMessages),
      }
    };

    const stringifiedOptions = JSON.stringify(requestOptions);
    const byteLength = Buffer.byteLength(stringifiedOptions, 'utf8') + " bytes";

    const timeoutTime = 10000;
    console.info('prepare to request for ', protocol);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        console.info('request took too long for', protocol);
        const errorMessage = `Request took over ${timeoutTime / 1000} seconds when sending messages for ${protocol} at ${service.api.send.endpoint} with payload of ${byteLength}\n\n${JSON.stringify(protocolMessages)}`;
        console.error(errorMessage, protocolMessages);
        reject(errorMessage);
      }, timeoutTime); // keep this below bot run time (which is 5000);

      return request(requestOptions).then((response) => {
        clearTimeout(timer);
        try {
          console.info('response status', response.statusCode);
        } catch (err) {
          console.info('no key for status code');
        }
        if (response.body) {
          if (hasBodyError(options, response.body, byteLength)) {
            resolve(null);
          }
        }
        console.info('Request is fine', response.body, byteLength);
        resolve(response);
      }).catch((err) => {
        clearTimeout(timer);
        console.error('error sending response', err, requestOptions);
        reject(err);
      });
    });
  })).then((response) => {
    if (messages.length > 0) {
      console.info('messages sent: ', messages.map(m => m.body));
      //console.info('messages are sent! within sendMessages');
    }
    return response;
  });
};

module.exports = sendMessages;
