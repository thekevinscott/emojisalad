import registry from 'microservice-registry';
import fetch from '../lib/fetch';

export default function fetchFromService(serviceName, path, options) {
  const service = registry.get(serviceName);
  const pathParts = path.split('.');

  const route = service.api[path[0]];

  const url = route.endpoint;
  const payload = {
    method: route.method,
    ...options,
  };

  return fetch(url, payload);
}
