const API_HOST = 'localhost';
const API_PORT = '5008';

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

