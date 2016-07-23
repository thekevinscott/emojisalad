const API_HOST = 'http://localhost';
const API_PORT = '5008';

import fetch from './fetch';

const Api = {
  fetch: (url) => {
    const parsedUrl = (url.indexOf(0) !== '/') ? `/${url}` : url;

    return fetch(`${API_HOST}:${API_PORT}${parsedUrl}`, {
      method: 'post',
    });
  },
};

export default Api;
