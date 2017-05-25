// update protocol on user
// copy messages over
import fetchFromService from '../../../utils/fetchFromService';

export default function createUser({ userId, token }) {
  return fetchFromService({
    service: 'api',
    route: 'users.create',
    options: {
      body: {
        protocol: 'appqueue',
        facebookId: userId,
        facebookToken: token,
      },
    },
  });
}
