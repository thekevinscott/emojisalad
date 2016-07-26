/* A convenience wrapper around fetch */

import fetch from 'isomorphic-fetch';

module.exports = function req({ url, ...rest }) {
  return fetch(url, rest).then(response => {
    if (response.status >= 400) {
      throw response;
    }
    return response.json();
  });
};
