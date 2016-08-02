import fetchFromService from '../../../utils/fetchFromService';

export default function getUserGames(userKey) {
  if (!userKey) {
    throw new Error('You must provide a user key');
  }
  return fetchFromService({
    service: 'api',
    route: 'games.get',
    options: {
      body: {
        user_key: userKey,
      },
    },
  });
}
