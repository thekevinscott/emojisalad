import fetchFromService from '../../../utils/fetchFromService';

export default function startNewGame(key) {
  if (!key) {
    throw new Error('You must provide a user key');
  }

  return fetchFromService({
    service: 'api',
    route: 'games.create',
    options: {
      body: {
        users: [
          {
            key,
          },
        ],
      },
    },
  });
}
