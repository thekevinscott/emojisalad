import fetchFromService from '../../../utils/fetchFromService';

export default startNewGame(userKey) {
  if (!userKey) {
    throw new Error('You must provide a user key');
  }

  return fetchFromService({
    service: 'api',
    route: 'games.create',
    options: {
      body: {
        user_key: userKey,
      },
    },
  });
}
