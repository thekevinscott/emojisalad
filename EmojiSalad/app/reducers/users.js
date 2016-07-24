import typeToReducer from 'type-to-reducer';

// TODO: Fix this import (should pull from index)
import {
  FETCH_GAMES,
} from '../modules/Games/types';

const initialState = {};

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => {
      return {
        ...state,
        ...action.payload.reduce((gameObj, game) => ({
          ...gameObj,
          ...game.players.reduce((obj, player) => ({
            ...obj,
            [player.user_id]: {
              id: player.user_id,
              nickname: player.nickname,
              blacklist: player.blacklist,
              avatar: player.avatar,
              protocol: player.protocol,
              user_archived: player.user_archived,
            },
          }), {}),
        }), {}),
      };
    },
  },
}, initialState);
