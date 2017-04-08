import registry from 'microservice-registry';
import fetch from './fetch';

function getApi(service, route) {
  if (route.length) {
    return getApi(service[route[0]], route.slice(1));
  }
  return service;
}

function parseEndpoint(url, params = {}) {
  let parsedUrl = url;

  Object.keys(params).forEach(k => {
    const key = `:${k}`;
    parsedUrl = parsedUrl.split(key).join(params[k]);
  });

  return parsedUrl;
}

function getRequestedRoute(service, route, routeParams) {
  const serviceEndpoint = (registry.get(service) || {}).api;
  if (serviceEndpoint) {
    const {
      endpoint,
      method,
    } = getApi(serviceEndpoint, route.split('.'));

    return {
      url: parseEndpoint(endpoint, routeParams),
      method,
    };
  }

  throw new Error(`No Endpoint for ${service}`);
}

export default function fetchFromService({
  service,
  route,
  routeParams,
  options,
}) {
  return new Promise((resolve, reject) => {
    try {
      const {
        url,
        method,
      } = getRequestedRoute(service, route, routeParams);

      if (!url) {
        reject(`URL does not exist for route: ${route}`);
      }

      const payload = {
        method,
        ...options,
      };

      //console.info('fetching with', url, payload);
      return fetch(url, payload).then(resolve).catch(resolve);
    } catch (err) {
      //console.error('err', err);
      reject(err.message);
    }
  });
}
