'use strict';

const registry = require('microservice-registry');
const Promise = require('bluebird');
const req = Promise.promisify(require('request'));
const request = function(options) {
  //console.log('options', options);
  return req(options).then(function(response) {
    //console.log('re', response);
    let body = response.body;
    try {
      body = JSON.parse(body);
    } catch(err) {}

    if ( body ) {
      return body;
    } else {
      throw new Error('No response from API in emoji');
    }
  });
}

let api_service = registry.get('api');

function getAPI() {
  return new Promise((resolve) => {
    if ( registry.get('api') ) {
      resolve(registry.get('api').api);
    } else {
      let interval = setInterval(() => {
        if ( registry.get('api') ) {
          clearInterval(interval);
          resolve(registry.get('api').api);
        }
      }, 100);
    }
  });
}

function makeRequest(namespace, key, payload) {
  return getAPI().then((api) => {
    let params = {
      url: `${api[namespace][key].endpoint}`,
      method: `${api[namespace][key].method}`
    };
    if ( params.method === 'GET' ) {
      params.qs = payload;
    } else {
      params.form = payload;
    }
    return request(params);
  });
}

module.exports = makeRequest;
