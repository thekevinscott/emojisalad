/* API */
export const ENVIRONMENT = 'production';
//export const ENVIRONMENT = 'development';
//export const ENVIRONMENT = 'development-device';

const LOCAL_IP = '192.168.0.8';

// Rest API timeout
export const NETWORK_TIMEOUT = 5000;

function getAPI(environment) {
  const API_PORT = '5012';
  if (environment === 'production') {
    return {
      API_HOST: 'http://app.emojisalad.com',
      API_PORT: '80',
      //http://app.emojisalad.com/
    };
    //return {
      //API_HOST: '45.55.41.73',
      //API_PORT,
    //};
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
export const PERSIST_DATA = true;

if (ENVIRONMENT === 'production' && !PERSIST_DATA) {
  console.warn('RESET is set to true in a production environment; are you sure about that?');
}

/* Push City */
export const PUSHCITY_API_KEY = '94065890d025a5989ddf0b67862d62739e77ef64af0c9e6050a46a9796380d43';

/* Logging */
export const REDUX_LOGGING_OPTIONS = {
  REMOTE_DEV: 'REMOTEDEV',
  SCOTTDESIGN: 'SCOTTDESIGN',
  LOCAL: 'LOCAL',
};
export const LOGGING = 2;
export const REDUX_LOGGING = REDUX_LOGGING_OPTIONS.REMOTE_DEV;

export const getReduxLoggingOptions = () => {
  if (REDUX_LOGGING === REDUX_LOGGING_OPTIONS.LOCAL) {
    return {
      hostname: '127.0.0.1',
      port: '8000',
    };
  } else if (REDUX_LOGGING === REDUX_LOGGING_OPTIONS.SCOTTDESIGN) {
    return {
      hostname: '104.131.180.22',
      port: '5501',
    };
  }

  return {};
};
