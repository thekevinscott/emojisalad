import fetchFromService from '../../../utils/fetchFromService';

export default function updateProtocolForUser(user) {
  console.info('updateProtocolForUser begin');
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
  }).then(response => {
    console.info('updateProtocolForUser complete');
    return response;
  });
}
