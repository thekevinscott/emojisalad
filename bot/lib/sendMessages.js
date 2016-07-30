'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
//const queues = require('config/services').queues;
const sendAlert = require('./sendAlert');
const registry = require('microservice-registry');

function sequence(tasks) {
  var current = Promise.cast();
  for (var k = 0; k < tasks.length; ++k) {
    current = current.then(tasks[k]);
  }
  return current;
}

function getGroupedMessages(messages) {
  const grouping = 5;
  const groupedMessages = [];
  for (var i = 0; i < Math.ceil(messages.length / grouping); i++) {
    const start = i * grouping;
    groupedMessages.push(messages.slice(start, start + grouping));
  }
  return groupedMessages;
}

const sendMessages = (messages, options = {}) => {
  //console.log('send 1');
  //console.info('messages to send', messages);

  if ( options.trip && messages.length >= options.trip ) {
    sendAlert(messages, 'tripped', 'send');
    throw new Error("Tripwire tripped on send, too many messages");
  } else if ( options.alert && messages.length >= options.alert ) {
    sendAlert(messages, 'alert', 'send');
    console.info(`Warning, alert tripped: ${messages.length}`);
  }

  const messages_by_protocol = messages.reduce((obj, message) => {
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
  //console.log('send 2');
  return Promise.all(Object.keys(messages_by_protocol).map((protocol) => {
    //console.log('send 3', protocol);
    //console.info('protocol', protocol);
    const messages = messages_by_protocol[protocol];
    const service = registry.get(protocol);
    //console.info('the messages to send', messages);
    //console.info('service', service);
    const requestOptions = {
      url: service.api.send.endpoint,
      method: service.api.send.method,
      form: {
        messages: JSON.stringify(messages),
      }
    };

    const stringifiedOptions = JSON.stringify(requestOptions);
    const byteLength = Buffer.byteLength(stringifiedOptions, 'utf8') + " bytes";

    function hasBodyError(options, body) {
      try {
        // if its not JSON, its probably an error
        JSON.parse(body);
      } catch (err) {
        if (body.indexOf('Error: request entity too large') !== -1) {
          throw new Error('Request too large: ' + byteLength);
        } else if (body.indexOf('PayloadTooLargeError') !== -1) {
          console.log(options, body);
          throw new Error('Payload Too Large Error: ' + byteLength);
        }

        console.log('unknown error', body);
        throw new Error('Unknown error' + byteLength + body);
      }
      return true;
    }

    return request(requestOptions).then((response) => {
      if (response.body) {
        if (hasBodyError(options, response.body)) {
          return null;
        }
      }
      //console.log('Request is fine', response.body, byteLength);
      return response;
    }).catch((err) => {
      //console.log('send 5a');
      console.error('error sending response', err);
      throw new Error(err);
    });

    /*
    return sequence(groupedMessages.map(groupOfMessages => {
      const groupOptions = Object.assign({}, options, {
        form: {
          messages: groupOfMessages,
        }
      });
      return () => {
        console.info('protocol options', groupOptions);
        return request(groupOptions).then((response) => {
          //console.log('send 5');
          //console.info('the gotten repsonse', response);
          return response;
        }).catch((err) => {
          //console.log('send 5a');
          console.info('error sending response', err);
        });
      };
    }));
    */
  })).then((response) => {
    if (messages.length > 0) {
      //console.log('send 6');
      console.info('already sent these messages', messages.map(m => m.body));
      //console.info('messages are sent! within sendMessages');
    }
    return response;
  });
};

module.exports = sendMessages;
