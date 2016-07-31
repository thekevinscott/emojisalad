import fetchFromService from '../lib/fetchFromService';

export default function getUserGames(userKey) {
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
