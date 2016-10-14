/* A convenience wrapper around fetch */

import fetch from 'isomorphic-fetch';
import querystring from 'querystring';

function parseURLAndOptions(url, options = {}) {
  if (options.qs && options.method === 'GET') {
    const qs = options.qs;
    delete options.qs;
    return {
      url: `${url}?${querystring.stringify(qs)}`,
      options,
    };
  }

  if (options.body) {
    const body = options.body;
    delete options.body;
    if (options.method === 'GET') {
      console.info('Dont do this anymore, pass body params to get requests as query string');
      console.info('this is probably coming from fetchfromservice; this logic could be moved there I believe');
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
  }).then(response => {
    //console.log('response', response);
    return response;
  });
};

