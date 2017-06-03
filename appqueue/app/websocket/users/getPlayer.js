// update protocol on user
// copy messages over
import fetchFromService from '../../../utils/fetchFromService';

export default function getPlayer(userKey, gameKey) {
  return fetchFromService({
    service: 'api',
    route: 'players.get',
    options: {
      body: {
        user_key: userKey,
        game_key: gameKey,
      },
    },
  });
}

