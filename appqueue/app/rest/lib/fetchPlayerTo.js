import fetchFromService from '../../../utils/fetchFromService';

export default function fetchPlayerTo(userKey, gameKey) {
  if (!userKey) {
    throw new Error('You must provide a user key');
  }
  if (!gameKey) {
    throw new Error('You must provide a game key');
  }
  return fetchFromService({
    service: 'api',
    route: 'players.get',
    options: {
      body: {
        user_key: userKey,
        game_key: gameKey,
      },
    },
  }).then(players => {
    if (players.length) {
      return players[0].to;
    }
    return null;
  });
}
