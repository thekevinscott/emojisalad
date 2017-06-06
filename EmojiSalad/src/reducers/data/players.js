import typeToReducer from 'type-to-reducer';

import {
  FETCH_GAMES,
} from 'app/pages/Games/types';

const initialState = {};

function getPlayersWithUserKeys(players) {
  return players.filter(player => {
    return player.user_key;
  });
}

const buildPlayer = player => ({
  userKey: player.user_key,
  gameKey: player.game_key,
});

const getPlayers = games => games.reduce((gameObj, el) => {
  if (el.type === 'game') {
    const game = el;
    return {
      ...gameObj,
      ...getPlayersWithUserKeys(game.players).reduce((playerObj, player) => ({
        ...playerObj,
        [player.key]: buildPlayer(player),
      }), {}),
    };
  } else if (el.type ==='invite') {
    //const game = el.game;
    return {
      ...gameObj,
      ...getPlayersWithUserKeys([el.inviter_player]).reduce((playerObj, player) => ({
        ...playerObj,
        [player.key]: buildPlayer(player),
      }), {}),
    };
  }

  return gameObj;
}, {});

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => {
      const players = getPlayers(action.data);

      return {
        ...state,
        ...players,
      };
    },
  },
}, initialState);

