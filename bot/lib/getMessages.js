'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const sendAlert = require('./sendAlert');
const registry = require('microservice-registry');

const getMessages = (timestamp, protocols, options = {}) => {
  //console.log('time to get messages');
  if ( ! timestamp ) {
    throw "You must provide a timestamp";
  } else if ( ! parseFloat(timestamp) ) {
    throw "You must provide a valid timestamp";
  }
  return Promise.all(protocols.map((protocol) => {
    //if ( queue_registrys[protocol] ) {
    const service = registry.get(protocol)
    if ( ! service ) {
      throw new Error(`No service found for protocol ${protocol}`);
    }
    return request({
      url: service.api.received.endpoint,
      method: service.api.received.method,
      qs: {
        date: timestamp
      }
    }).then((response) => {
      if ( ! response || ! response.body ) {
        throw response;
      }
      let body = response.body;

      // if err, already parsed
      try { body = JSON.parse(body); } catch(err) {}

      body = body.map((b) => {
        b.protocol = protocol;
        return b;
      });
      return body;
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
      console.info(`Warning, alert tripped: ${responses.length}`);
    }
    return responses;
  });
};

module.exports = getMessages;
