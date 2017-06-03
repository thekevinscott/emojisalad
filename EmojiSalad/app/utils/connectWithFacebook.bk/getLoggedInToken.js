import graphRequest from './graphRequest';

const LOGGED_OUT_CODE = 'ECOM.FACEBOOK.SDK.CORE8';
const getLoggedInToken = () => {
  return graphRequest('/me').then(result => {
    if (result && result.id) {
      return true;
    }

    console.error(result);
    throw new Error('Bad result');
  }).catch(err => {
    if (err && err.code === LOGGED_OUT_CODE) {
      return false;
    }

    throw err;
  });
}

export default getLoggedInToken;
