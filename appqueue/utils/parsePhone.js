'use strict';
const registry = require('microservice-registry');
const request = require('./request');

module.exports = function parsePhone(number) {
  const service = registry.get('sms');

  const payload = {
    url: service.api.phone.endpoint,
    method: service.api.phone.method,
    qs: {
      number,
    },
  };

  return request(payload).then(response => {
    return response.number;
  });
};
