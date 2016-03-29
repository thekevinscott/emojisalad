'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const sendAlert = require('./sendAlert');
const registry = require('microservice-registry');

//const getMessages = (timestamp, protocols, options = {}) => {
const getMessages = (ids, protocols, options = {}) => {
  //console.log('time to get messages');
  if ( ids === undefined ) {
    throw "You must provide ids";
  }

  return Promise.all(protocols.map((protocol) => {
    //if ( queue_registrys[protocol] ) {
    const service = registry.get(protocol);
    if ( ! service ) {
      throw new Error(`No service found for protocol ${protocol}`);
    }
    const payload = {
      url: service.api.received.endpoint,
      method: service.api.received.method,
      qs: {
        id: ids[protocol]
      }
    };
    //console.log('payload', payload);
    return request(payload).then((response) => {
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
    return [].concat(...responses);
    //return [].concat.apply([], responses);
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
