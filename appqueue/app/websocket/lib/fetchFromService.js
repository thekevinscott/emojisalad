import registry from 'microservice-registry';
import fetch from '../lib/fetch';

export default function fetchFromService(service
module.exports = (from) => {
  const service = registry.get('api');

  const url = service.api.users.endpoint;
  const payload = {
    method: service.api.users.get.method,
    qs: {
      from,
    },
  };

  return fetch(url, payload).then(users => {
    console.log('users', users);
    return users;
  });
};

