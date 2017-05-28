import fetchFromService from '../../../utils/fetchFromService';

export default function updateGame(gameKey, params) {
  return fetchFromService({
    service: 'api',
    route: 'games.update',
    routeParams: {
      game_id: gameKey,
    },
    options: {
      body: params,
    },
  });
}

