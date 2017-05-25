import {Facebook, FacebookApiException} from 'fb';

const getFb = token => {
  const fb = new Facebook({ });
  fb.setAccessToken(token);
  const api = url => new Promise((resolve, reject) => {
    fb.api(url, res => {
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
