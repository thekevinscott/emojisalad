'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const queue_services = require('config/services').queues;
const sendAlert = require('./sendAlert');

const getMessages = (timestamp, protocols, options = {}) => {
  if ( ! timestamp ) {
    throw "You must provide a timestamp";
  } else if ( ! parseFloat(timestamp) ) {
    throw "You must provide a valid timestamp";
  }
  return Promise.all(protocols.map((protocol) => {
    if ( queue_services[protocol] ) {
      return request({
        url: queue_services[protocol].received,
        method: 'GET',
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

        return body.map((b) => {
          b.protocol = protocol;
          return b;
        });
      }).catch((err) => {
        console.error(err);
        throw err;
      });
    } else {
      throw `Protocol not defined for ${protocol}`;
    }
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
