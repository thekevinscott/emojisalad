'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const sendAlert = require('./sendAlert');
const registry = require('microservice-registry');
const track = require('./analytics');
//const Protocol = require('./protocol');

function getMessagesFromProtocol(ids) {
  return protocol => {
    const service = registry.get(protocol);
    //console.info('getting message from protocol', protocol);
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
    //console.info('payload', payload);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        console.info('timer timed out');
        reject('Request timed out for: ' + protocol);
      }, 5000);

      return request(payload).then((response) => {
        clearTimeout(timer);
        //console.info('got response');
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
        console.info('the body', body);
        resolve(body);
        if (protocol !== 'testqueue') {
          track.incoming(body);
        }
      }).catch((err) => {
        clearTimeout(timer);
        console.info('err', err);
        if (err.code === 'ECONNREFUSED') {
          console.error('Service is not responsive', protocol, Object.keys(service.api).map(key => {
            if (service.api[key].endpoint) {
              return service.api[key].endpoint;
            }
          }).filter(el => el).join(', '));
          resolve([]);
        } else {
          console.error('Error connecting to service', protocol, err);
          reject(err);
        }
      });
    });
  };
}


//const getMessages = (timestamp, protocols, options = {}) => {
const getMessages = (ids, protocols, options = {}) => {
  //console.log('time to get messages');
  if ( ids === undefined ) {
    throw new Error("You must provide ids");
  }

  //console.info('the protocols', protocols);

  return Promise.all(protocols.map(getMessagesFromProtocol(ids))).then(responses => {
    //console.info('messages back', responses);
    // flatten the messages
    return [].concat(...responses);
  }).then((responses) => {
    if (responses.length) {
      //console.info('response back', responses);
    }
    if ( options.trip && responses.length >= options.trip ) {
      sendAlert(responses, 'tripped', 'get');
      throw new Error("Tripwire tripped on get, too many messages");
    } else if ( options.alert && responses.length >= options.alert ) {
      sendAlert(responses, 'alert', 'get');
      console.info(`Warning, alert tripped: ${responses.length}`);
    }
    return responses;
  }).catch(err => {
    console.error('There was an error', err);
    throw err;
  });
};

module.exports = getMessages;
