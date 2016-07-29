import fetchFromService from '../lib/fetchFromService';

export default function fetchGames(ws, payload) {
  const userId = payload.userId;

  return fetchFromService({
    service: 'api',
    route: 'games',
    options: {
      body: {
        user_id: userId,
      },
    },
  }).then(response => {
    console.log('games', response);
    return response;
  });
}
