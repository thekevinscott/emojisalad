import fetchFromService from '../lib/fetchFromService';

export default function updateProtocolForUser(user) {
  return fetchFromService({
    service: 'api',
    route: 'users.update',
    routeParams: {
      user_id: user.id,
    },
    options: {
      body: {
        protocol: 'appqueue',
      },
    },
  });
}
