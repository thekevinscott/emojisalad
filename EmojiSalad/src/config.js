export const ENVIRONMENT = 'production';
//export const ENVIRONMENT = 'development';
//export const ENVIRONMENT = 'development-device';

const LOCAL_IP = '192.168.0.8';

// Rest API timeout
export const NETWORK_TIMEOUT = 5000;

// Raven error logging
export const RAVEN_URL = 'https://32267e621577475095319f5baf4c837b@sentry.io/115596';

function getAPI(environment) {
  const API_PORT = '5012';
  if (environment === 'production') {
    return {
      API_HOST: 'http://app.emojisalad.com',
      API_PORT: '80',
      //http://app.emojisalad.com/
    };
  } else if (environment === 'development') {
    return {
      API_HOST: 'localhost',
      API_PORT,
    };
  } else if (environment === 'development-device') {
    return {
      API_HOST: LOCAL_IP,
      API_PORT,
    };
  }
  return {
    API_HOST: 'localhost',
    API_PORT,
  };
}

const apiConfig = getAPI(ENVIRONMENT);

export const API_HOST = apiConfig.API_HOST;
export const API_PORT = apiConfig.API_PORT;

/* Storage */
export const KEY = '@EmojiSalad';
export const PERSIST_DATA = 0;

if (ENVIRONMENT === 'production' && !PERSIST_DATA) {
  console.warn('RESET is set to true in a production environment; are you sure about that?');
}
