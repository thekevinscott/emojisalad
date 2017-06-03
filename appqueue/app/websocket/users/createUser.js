// update protocol on user
// copy messages over
import fetchFromService from '../../../utils/fetchFromService';

export default function createUser({
  userId,
  token,
  tokenExpirationDate,
  permissions,
}) {
  return fetchFromService({
    service: 'api',
    route: 'users.create',
    options: {
      body: {
        protocol: 'appqueue',
        facebookId: userId,
        facebookToken: token,
        facebookPermissions: JSON.stringify(permissions),
        facebookTokenExpiration: (new Date(tokenExpirationDate)).getTime(),
        confirmed_avatar: 1,
        confirmed: 1,
      },
    },
  });
}
