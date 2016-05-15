'use strict';
const registry = require('microservice-registry');
const fetch = require('isomorphic-fetch');
module.exports = (route, method, body, protocol, endpointCallback) => {
  let endpoint;
  if (!protocol) { protocol = 'api'; }
  const manifest = registry.get(protocol).api;
  if (endpointCallback) {
    endpoint = endpointCallback(manifest);
  } else {
    endpoint = manifest.games.get.endpoint.substring(0, 22);
  }
  route = `${endpoint}${route}`;

  return fetch(route, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: (method.toLowerCase() !== 'get') ? JSON.stringify(body) : null
  }).then((response) => {
    return response.json();
  });
};
