'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const services = require('config/services');

const port = services.api.port;
const api = (params) => {
  const url = `http://localhost:${port}/${params.url}`;

  let options = {
    url: url,
    method: params.method || 'GET',
  };

  if ( options.method === 'GET' ) {
    options.qs = params.data;
  } else {
    options.form = params.data;
  }

  return request(options).then((res) => {
    if ( res && res.body ) {
      let body = res.body;
      try {
        body = JSON.parse(body);
      } catch(err) {}
      return body;
    }
  }).catch((err) => {
    console.error(err);
  });
}

module.exports = api;
