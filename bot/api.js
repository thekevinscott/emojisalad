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
      throw new Error(`No response from API: ${JSON.stringify(options)}`);
    }
  });
}

let api_service = registry.get('api');

function getAPI() {
  const pinging_interval = 50;
  return new Promise((resolve) => {
    if ( registry.get('api') ) {
      resolve(registry.get('api').api);
    } else {
      let interval = setInterval(() => {
        if ( registry.get('api') ) {
          clearInterval(interval);
          resolve(registry.get('api').api);
        }
      }, pinging_interval);
    }
  });
}

function makeRequest(namespace, key, payload, params = {}) {
  return getAPI().then((api) => {
    if ( !api[namespace] ) {
      throw new Error(`No namespace for ${namespace}`);
    } else if ( !api[namespace][key] ) {
      throw new Error(`No key for ${namespace} ${key}`);
    }
    let data = {
      url: processEndpoint(`${api[namespace][key].endpoint}`, params),
      method: `${api[namespace][key].method}`
    };
    if ( data.method === 'GET' ) {
      data.qs = payload;
    } else {
      data.form = payload;
    }

    //console.debug('data', data);

    return request(data).then((res) => {
      console.info('response back!');
      return res;
    });
  });
}

const processEndpoint = (endpoint, params = {}) => {
  const parts = endpoint.split(/^(.*):\/\/([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)/);
  let rest;
  while ( ! rest && parts.length ) {
    rest = parts.pop();
  }
  const keys = Object.keys(params);
  const processed_rest = rest.split('/').map((piece) => {
    const index = keys.indexOf(piece.substring(1));
    if ( piece.substring(0,1) === ':' && index !== -1 ) {
      const key = keys[index];
      return params[key];
    } else {
      return piece;
    }
  });

  return [
    parts[1],
    '://',
    parts[2],
    parts[3],
    processed_rest.join('/')
  ].join('')
}

module.exports = makeRequest;
