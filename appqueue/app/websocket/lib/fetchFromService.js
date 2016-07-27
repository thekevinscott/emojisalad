import registry from 'microservice-registry';
import fetch from '../lib/fetch';

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
  const serviceEndpoint = registry.get(service).api;
  const {
    endpoint,
    method,
  } = getApi(serviceEndpoint, route.split('.'));

  return {
    url: parseEndpoint(endpoint, routeParams),
    method,
  };
}

export default function fetchFromService({
  service,
  route,
  routeParams,
  options,
}) {
  const {
    url,
    method,
  } = getRequestedRoute(service, route, routeParams);

  const payload = {
    method,
    ...options,
  };

  return fetch(url, payload);
}
