import {
  NETWORK_TIMEOUT,
} from '../../../config';

export default function newFetch(url, options = {}) {
  const parsedOptions = {
    ...options,
    method: (options.method || 'get').toUpperCase(),
    body: (options.body) ? JSON.stringify(options.body) : null,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const getErrorMessage = (response) => {
    //console.log('response status', response.status);
    if (response.status === 404) {
      console.log(`Error: URL not found: ${url}`);
    } else if (response.status === 500) {
      try {
        const json = JSON.parse(response._bodyText);
        // see if there's a json response
        if (json.error) {
          return json.error;
        }
      } catch (err) {
        console.log('error parsing json', err);
        // swallow the error
      }
    } else {
      console.log('Error: Bad response from server', response);
    }

    return 'There was an error, please try again later.';
  };

  const handleErrors = (response) => {
    if (response.status >= 400) {
      throw new Error(getErrorMessage(response));
    }

    return response.json();
  };

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.log('error: timeout', url);
      reject(new Error('fetch timed out'));
    }, NETWORK_TIMEOUT);

    fetch(url, parsedOptions)
    .then(handleErrors)
    .then(response => {
      clearTimeout(timeout);
      return response;
    })
    .then(resolve, reject);
  });
}
