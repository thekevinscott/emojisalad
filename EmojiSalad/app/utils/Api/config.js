export const NETWORK_TIMEOUT = 5000;
const ENVIRONMENT = 'production';

function getAPI(environment) {
  if (environment === 'production') {
    return {
      API_HOST: '45.55.41.73',
      API_PORT: '5012',
    };
  }
  return {
    API_HOST: 'localhost',
    API_PORT: '5008',
  };
}
const {
  API_HOST: h,
  API_PORT: p,
} = getAPI(ENVIRONMENT);

export const API_HOST = h;
export const API_PORT = p;
