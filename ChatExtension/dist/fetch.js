"use strict";

var fetch = require('isomorphic-fetch');

module.exports = function (url, options) {
  var headers = {
    "Content-Type": "application/json"
  };

  return fetch(url, {
    method: options.method || 'get',
    headers: headers,
    body: JSON.stringify(options.body || {})
  }).then(function (resp) {
    return resp.json();
  });
};