'use strict';
const registry = require('microservice-registry');
const request = require('./request');

module.exports = (from) => {
  const service = registry.get('api');

  const payload = {
    url: service.api.users.get.endpoint,
    method: service.api.users.get.method,
    qs: {
      from,
    },
  };

  return request(payload).then(users => {
    console.log('users', users);
    return users;
  });
};
