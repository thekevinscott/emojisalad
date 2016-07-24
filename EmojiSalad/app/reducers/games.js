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
        ...action.payload.reduce((obj, game) => {
          return {
            ...obj,
            [game.id]: {
              id: game.id,
              created: game.created,
              archived: game.archived,
              round_count: game.round_count,
              players: game.players.map(player => player.id),
              round: {
                id: game.round.id,
                phrase: game.round.phrase,
                clue: game.round.clue,
                winner: game.round.winner,
                submission: game.round.submission,
                created: game.round.created,
              },
            },
          };
        }, {}),
      };
    },
  },
}, initialState);
