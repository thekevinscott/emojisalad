'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
//const queue_services = require('config/services').queues;
const sendAlert = require('./sendAlert');
const services = require('../services');

const getMessages = (timestamp, protocols, options = {}) => {
  //console.log('time to get messages');
  if ( ! timestamp ) {
    throw "You must provide a timestamp";
  } else if ( ! parseFloat(timestamp) ) {
    throw "You must provide a valid timestamp";
  }
  //console.log('prepare to iterate over protocols', protocols);
  return Promise.all(protocols.map((protocol) => {
    //console.log('get the protocol', protocol);
    //if ( queue_services[protocol] ) {
    return services.get(protocol).then((service) => {
      //console.log('endpoints', service.endpoints);
      return request({
        url: service.endpoints.received.url,
        method: service.endpoints.received.method,
        qs: {
          date: timestamp
        }
      });
    }).then((response) => {
      //console.log('response', response);
      if ( ! response || ! response.body ) {
        throw response;
      }
      let body = response.body;

      // if err, already parsed
      try { body = JSON.parse(body); } catch(err) {}

      return body.map((b) => {
        b.protocol = protocol;
        return b;
      });
    }).catch((err) => {
      console.error(err);
      throw err;
    });
  })).then((responses) => {
    return [].concat.apply([], responses);
  }).then((responses) => {
    if ( options.trip && responses.length >= options.trip ) {
      sendAlert(responses, 'tripped', 'get');
      throw "Tripwire tripped on get, too many messages";
    } else if ( options.alert && responses.length >= options.alert ) {
      sendAlert(responses, 'alert', 'get');
      console.debug(`Warning, alert tripped: ${responses.length}`);
    }
    return responses;
  });
};

module.exports = getMessages;
