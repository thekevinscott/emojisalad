import typeToReducer from 'type-to-reducer';

import {
  FETCH_GAMES,
} from '../../modules/Games/types';

const initialState = {};

function getPlayersWithUserKeys(players) {
  return players.filter(player => {
    return player.user_key;
  });
}

function getUsers(games) {
  return games.reduce((gameObj, game) => ({
    ...gameObj,
    ...getPlayersWithUserKeys(game.players).reduce((playerObj, player) => ({
      ...playerObj,
      [player.user_key]: player,
    }), {}),
  }), {});
}

function translateUser(user) {
  return {
    //key: user.user_key,
    nickname: user.nickname,
    blacklist: user.blacklist,
    avatar: user.avatar,
    protocol: user.protocol,
    archived: user.user_archived,
  };
}

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => {
      const users = getUsers(action.data);
      return {
        ...state,
        ...Object.keys(users).reduce((obj, userKey) => {
          return {
            ...obj,
            [userKey]: translateUser(users[userKey]),
          };
        }, {}),
      };
    },
  },
}, initialState);
