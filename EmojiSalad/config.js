/* API */
//export const ENVIRONMENT = 'production';
export const ENVIRONMENT = 'development';

// Rest API timeout
export const NETWORK_TIMEOUT = 5000;

function getAPI(environment) {
  if (environment === 'production') {
    return {
      API_HOST: '45.55.41.73',
      API_PORT: '5012',
    };
  }
  return {
    API_HOST: 'localhost',
    API_PORT: '5009',
  };
}

const apiConfig = getAPI(ENVIRONMENT);

export const API_HOST = apiConfig.API_HOST;
export const API_PORT = apiConfig.API_PORT;

/* Storage */
export const KEY = '@EmojiSalad';
export const RESET = false;

if (ENVIRONMENT === 'production' && !RESET) {
  console.warn('RESET is set to true in a production environment; are you sure about that?');
}
