'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const registry = require('microservice-registry');
Promise.promisifyAll(request);
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const api = db.api;

const getUser = (userId) => {
  const service = registry.get('api');

  const payload = {
    url: `${service.api.users.get.endpoint}/${userId}`,
    method: service.api.users.get.method,
  };

  return request(payload).then(response => {
    if (! response || ! response.body) {
      throw response;
    }
    return response.body;
  }).then(response => {
    return JSON.parse(response);
  });
};

module.exports = getUser;

