
'use strict';

const registry = require('microservice-registry');
const Promise = require('bluebird');
const req = Promise.promisify(require('request'));
const request = function(options) {
  return req(options).then((response) => {
    let body = response.body;
    try {
      body = JSON.parse(body);
    } catch(err) {}

    if ( body ) {
      return body;
    } else {
      throw new Error(`No response from service: ${JSON.stringify(options)}`);
    }
  });
};

function getService(name) {
  const pinging_interval = 50;
  return new Promise((resolve) => {
    if ( registry.get(name) ) {
      resolve(registry.get(name).api);
    } else {
      const interval = setInterval(() => {
        if ( registry.get(name) ) {
          clearInterval(interval);
          resolve(registry.get(name).api);
        }
      }, pinging_interval);
    }
  });
}

const processEndpoint = (endpoint, params) => {
  if (! params) { params = {}; }
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
  ].join('');
};

module.exports = function(name) {
  if ( ! name ) {
    throw "You must provide a valid name for a service now";
  }
  return function(namespace, key, payload, params) {
    if (! params ) {
      params = {};
    }
    //console.debug('make request');
    return getService(name).then((service) => {
      //console.log('service', name, namespace);
      if ( !service[namespace] ) {
        //console.log('1');
        console.error(service, name, namespace);
        throw new Error(`No namespace for ${namespace}`);
      } else if ( !service[namespace][key] ) {
        //console.log('2');
        throw new Error(`No key for ${namespace} ${key}`);
      }
      const data = {
        url: processEndpoint(`${service[namespace][key].endpoint}`, params),
        method: `${service[namespace][key].method}`
      };
      if ( data.method === 'GET' ) {
        data.qs = payload;
      } else {
        data.form = payload;
      }

      //console.debug('data', data);

      console.info('request', data);
      return request(data).then((res) => {
        console.info('response back:', res);
        return res;
      });
    });
  };
};
