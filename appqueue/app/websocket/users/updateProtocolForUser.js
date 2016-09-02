import fetchFromService from '../../../utils/fetchFromService';

export default function updateProtocolForUser(user) {
  console.log('updateProtocolForUser begin');
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
    console.log('updateProtocolForUser complete');
    return response;
  });
}
