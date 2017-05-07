import fetchFromService from '../../../../utils/fetchFromService';

// This function will, given a user key and game key,
// query the API for players matching those parameters.
//
// If no players are found, then check the invite log.
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
  console.info('get players', qs);
  return fetchFromService({
    service: 'api',
    route: 'players.get',
    options: {
      qs,
    },
  }).then(players => {
    if (!players.length) {
      return fetchFromService({
        service: 'api',
        route: 'players.get',
        options: {
          invited_from_key: userKey,
          game_key: gameKey,
          used: 0,
        },
      }).then(invites => {
        console.info('invites back', invites);
        if (!invites.length) {
          console.info('no players found', players, qs);
          throw new Error(`No sender Id found for user key ${userKey} and ${gameKey}`);
        }

        return invites[0].invited_user.to;
      });
    }
    return players[0].to;
  });
}
