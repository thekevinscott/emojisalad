import fetchFromService from '../lib/fetchFromService';

export default function updateProtocolForUser(user) {
  console.info('update protocol for user');
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
