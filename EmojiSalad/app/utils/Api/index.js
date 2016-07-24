import {
  API_PORT,
  API_HOST,
} from './config';

import fetch from './fetch';
import {
  socketSend,
} from './websocket';

const Api = {
  fetch: (url, options) => {
    const parsedUrl = (url.indexOf(0) !== '/') ? `/${url}` : url;

    return fetch(`http://${API_HOST}:${API_PORT}${parsedUrl}`, options);
  },
  socketSend,
};

export default Api;

