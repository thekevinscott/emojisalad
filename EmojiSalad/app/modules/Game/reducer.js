import typeToReducer from 'type-to-reducer';

import {
  FETCH_GAMES,
} from '../Games/types';

import {
  //INCREMENT_PAGE,
  UPDATE_COMPOSE,
  FETCH_MESSAGES,
  SEND_MESSAGE,
} from './types';

//const DEFAULT_PAGE = 1;

const initialState = {};

function getNewGameState(gameKey, state, action) {
  //if (action.meta && action.meta.loadEarlier) {
  const messages = action.data.messages;
  const first = messages[messages.length - 1].key;
  const last = messages[0].key;
  return {
    ...state[gameKey],
    seen: {
      //...state[gameKey],
      first,
      last,
    },
  };
  //}

  //return state[gameKey];
}

export default typeToReducer({
  [FETCH_MESSAGES]: {
    FULFILLED: (state, action) => {
      const gameKey = action.data.key;
      const newGameState = getNewGameState(gameKey, state, action);
      return {
        ...state,
        [action.data.key]: newGameState,
      };
    },
  },
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => ({
      ...state,
      ...action.data.reduce((obj, game) => {
        const key = game.key;
        const currentGame = state[key] || {};
        return {
          ...obj,
          [key]: {
            compose: currentGame.compose || '',
            seen: {
              first: (currentGame.seen || {}).first || null,
              last: (currentGame.seen || {}).last || null,
            },
          },
        };
      }, {}),
    }),
  },
  [UPDATE_COMPOSE]: (state, { gameKey, text }) => {
    return {
      ...state,
      [gameKey]: {
        ...state[gameKey],
        compose: text,
      },
    };
  },
  [SEND_MESSAGE]: {
    FULFILLED: (state, { data }) => {
      const gameKey = data.gameKey;
      console.log('data', data);
      return {
        ...state,
        [gameKey]: {
          //...state[gameKey],
          compose: '',
          seen: {
            ...state[gameKey].seen,
            //last:
          },
        },
      };
    },
  },
}, initialState);
