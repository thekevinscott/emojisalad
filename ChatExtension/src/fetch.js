const fetch = require('isomorphic-fetch');

module.exports = (url, options) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return fetch(url, {
    method: options.method || 'get',
    headers,
    body: JSON.stringify(options.body || {}),
  }).then(resp => resp.json());
};
