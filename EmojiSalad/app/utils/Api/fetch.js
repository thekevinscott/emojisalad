const TIMEOUT = 5000;

export default function f(url, options) {
  const parsedOptions = {
    ...options,
    method: options.method.toUpperCase(),
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('error: timeout', url);
      reject(new Error('fetch timed out'));
    }, TIMEOUT);

    fetch(url, parsedOptions).then(response => {
      if (response.status >= 400) {
        if (response.status === 404) {
          console.log(`Error: URL not found: ${url}`);
        } else {
          console.log('Error: Bad response from server', response);
        }
        throw new Error('There was an error, please try again later.');
      }

      return response.json();
    }).then(resolve, reject);
  });
}
