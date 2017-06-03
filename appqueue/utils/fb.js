import {Facebook, FacebookApiException} from 'fb';

const getFb = token => {
  const fb = new Facebook({ });
  fb.setAccessToken(token);
  const api = (url, options = {}) => new Promise((resolve, reject) => {
    fb.api(url, options, res => {
      if(!res || res.error) {
        reject(!res ? 'error occurred' : res.error);
      } else {
        resolve(res);
      }
    });
  });

  return Promise.resolve(api);
};

export default getFb;
