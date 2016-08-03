import fetchFromService from '../../../../utils/fetchFromService';

export default function fetchPlayerTo(userKey, senderId) {
  if (!userKey) {
    throw new Error('You must provide a user key');
  }
  if (!senderId) {
    throw new Error('You must provide a sender id');
  }

  const qs = {
    user_key: userKey,
    to: senderId,
  };
  return fetchFromService({
    service: 'api',
    route: 'players.get',
    options: {
      qs,
    },
  }).then(players => {
    console.log('players back', players);
    if (!players.length || !players[0].game_key) {
      console.info('no game key found', userKey, senderId, qs);
      throw new Error(`No game key found for ${userKey} and ${senderId}`);
    }
    return players[0].game_key;
  });
}

