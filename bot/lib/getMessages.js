'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const sendAlert = require('./sendAlert');
const registry = require('microservice-registry');
//const Protocol = require('./protocol');

//const getMessages = (timestamp, protocols, options = {}) => {
const getMessages = (ids, protocols, options = {}) => {
  //console.log('time to get messages');
  if ( ids === undefined ) {
    throw new Error("You must provide ids");
  }

  //console.info('the protocols', protocols);

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
      try { body = JSON.parse(body); } catch (err) {
        // do nothing
      }

      body = body.map((b) => {
        b.protocol = protocol;
        //b.protocol_id = Protocol.getID(protocol);
        return b;
      });
      return body;
    }).catch((err) => {
      if (err.code === 'ECONNREFUSED') {
        console.error('Service is not responsive', protocol);
        return [];
      } else {
        console.error('Error connecting to service', protocol, err);
        throw err;
      }
    });
  })).then((responses) => {
    return [].concat(...responses);
  }).then((responses) => {
    if (responses.length) {
      console.info('response back', responses);
    }
    if ( options.trip && responses.length >= options.trip ) {
      sendAlert(responses, 'tripped', 'get');
      throw new Error("Tripwire tripped on get, too many messages");
    } else if ( options.alert && responses.length >= options.alert ) {
      sendAlert(responses, 'alert', 'get');
      console.info(`Warning, alert tripped: ${responses.length}`);
    }
    return responses;
  });
};

module.exports = getMessages;
