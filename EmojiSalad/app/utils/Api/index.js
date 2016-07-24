import {
  API_PORT,
  API_HOST,
} from './config';

import fetch from './fetch';
import {
  sendMessage,
} from './websocket';

const Api = {
  sendMessage,
  fetch: (url, options) => {
    const parsedUrl = (url.indexOf(0) !== '/') ? `/${url}` : url;

    return fetch(`http://${API_HOST}:${API_PORT}${parsedUrl}`, options);
  },
};

export default Api;

