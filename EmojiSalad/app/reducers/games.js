import typeToReducer from 'type-to-reducer';

// TODO: Fix this import (should pull from index)
import {
  FETCH_GAMES,
} from '../modules/Games/types';

const initialState = {};

function translateRound(round = {}) {
  return {
    key: round.key,
    phrase: round.phrase,
    clue: round.clue,
    winner: round.winner,
    submission: round.submission,
    created: round.created,
  };
}

function translateGame(game) {
  return {
    key: game.key,
    created: game.created,
    archived: game.archived,
    round_count: game.round_count,
    players: game.players.map(player => player.user_key),
    round: translateRound(game.round || {}),
  };
}

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => {
      return {
        ...state,
        ...action.data.reduce((obj, game) => {
          return {
            ...obj,
            [game.key]: translateGame(game),
          };
        }, {}),
      };
    },
  },
}, initialState);
