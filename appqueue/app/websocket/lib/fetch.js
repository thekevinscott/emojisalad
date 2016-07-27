/* A convenience wrapper around fetch */

import fetch from 'isomorphic-fetch';
import querystring from 'querystring';

function parseURLAndOptions(url, options) {
  if (options.body) {
    const body = options.body;
    delete options.body;
    if (options.method === 'GET') {
      return {
        url: `${url}?${querystring.stringify(body)}`,
        options,
      };
    }

    return {
      url,
      options: {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
        body: JSON.stringify(body),
      },
    };
  }

  return {
    url,
    options,
  };
}

module.exports = function req(origUrl, origOptions) {
  const {
    url,
    options,
  } = parseURLAndOptions(origUrl, origOptions);

  return fetch(url, options).then(response => {
    if (response.status >= 400) {
      throw response;
    }
    return response.json();
  });
};
