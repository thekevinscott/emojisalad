import fetchFromService from '../../../utils/fetchFromService';

export default function getUserInvites(userKey) {
  if (!userKey) {
    throw new Error('You must provide a user key');
  }
  return fetchFromService({
    service: 'api',
    route: 'invites.get',
    options: {
      body: {
        invited_from_key: userKey,
        used: 0,
      },
    },
  });
}

