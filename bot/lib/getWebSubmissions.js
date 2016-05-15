'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const sendAlert = require('./sendAlert');
const registry = require('microservice-registry');

const getWebSubmissions = (ids) => {
  const protocol = 'web';
  const service = registry.get(protocol);
  if ( service ) {
    const payload = {
      url: service.api.received.endpoint,
      method: service.api.received.method,
      qs: {
        id: ids[protocol]
      }
    };
    return request(payload).then((response) => {
      if ( ! response || ! response.body ) {
        throw response;
      }
      let body = response.body;

      // if err, already parsed
      try { body = JSON.parse(body); } catch(err) {}

      return body;
    }).catch((err) => {
      console.error(err);
      throw err;
    });
  }
};

module.exports = getWebSubmissions;
