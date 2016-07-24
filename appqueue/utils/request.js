'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const registry = require('microservice-registry');
Promise.promisifyAll(request);

module.exports = function req(payload) {
  return request(payload).then(response => {
    if (! response || ! response.body) {
      throw response;
    }
    return response.body;
  }).then(response => {
    return JSON.parse(response);
  });
};
