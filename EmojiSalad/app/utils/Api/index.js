const API_HOST = 'http://localhost';
const API_PORT = '5008';

const f = (url, options) => {
  const parsedOptions = {
    ...options,
    method: options.method.toUpperCase(),
  };
  return fetch(url, parsedOptions).then(response => {
    if (response.status >= 400) {
      if (response.status === 404) {
        console.log(`Error: URL not found: ${url}`);
      } else {
        console.log('Error: Bad response from server', response);
      }
      throw new Error('There was an error, please try again later.');
    }

    return response.json();
  });
};

const Api = {
  fetch: (url) => {
    const parsedUrl = (url.indexOf(0) !== '/') ? `/${url}` : url;

    return f(`${API_HOST}:${API_PORT}${parsedUrl}`, {
      method: 'post',
    });
  },
};

export default Api;
