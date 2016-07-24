import typeToReducer from 'type-to-reducer';

import {
  FETCH_GAMES,
} from '../types';

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
            [player.id]: {
              id: player.id,
              created: player.created,
              archived: player.archived,
              to: player.to,
              user_id: player.user_id,
            },
          }), {}),
        }), {}),
      };
    },
  },
}, initialState);
