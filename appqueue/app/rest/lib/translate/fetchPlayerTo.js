import fetchFromService from '../../../../utils/fetchFromService';

export default function fetchPlayerTo(userKey, gameKey) {
  if (!userKey) {
    throw new Error('You must provide a user key');
  }
  if (!gameKey) {
    throw new Error('You must provide a game key');
  }
  const qs = {
    user_key: userKey,
    game_key: gameKey,
  };
  //console.log('body', body);
  return fetchFromService({
    service: 'api',
    route: 'players.get',
    options: {
      qs,
    },
  }).then(players => {
    if (! players.length || !players[0].to) {
      console.info('no players found', players, qs);
      throw new Error(`No sender Id found for user key ${userKey} and ${gameKey}`);
    }
    return players[0].to;
  });
}
