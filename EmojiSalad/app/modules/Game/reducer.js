import typeToReducer from 'type-to-reducer';

import {
  ActionConst,
} from 'react-native-router-flux';

import {
  FETCH_GAMES,
} from '../Games/types';

import {
  //INCREMENT_PAGE,
  UPDATE_COMPOSE,
  FETCH_MESSAGES,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  LOAD_EARLIER,
} from './types';

//const DEFAULT_PAGE = 1;

const initialState = {};

const getFirstAndLastMessages = (messages = [], currentGame = {}) => {
  if (messages.length) {
    return {
      first: messages[messages.length - 1].key,
      last: messages[0].key,
    };
  }

  const {
    first,
    last,
  } = currentGame.seen || {};

  return {
    first,
    last,
  };
};

const updateGameSeen = (state, gameKey, payload = {}) => {
  return {
    active: state[gameKey].active,
    compose: '',
    seen: {
      ...state[gameKey].seen,
      ...payload,
    },
  };
};

export default typeToReducer({
  [ActionConst.FOCUS]: (state, { scene }) => {
    const {
      game,
    } = scene;
    return Object.keys(state).reduce((obj, gameKey) => {
      return {
        ...obj,
        [gameKey]: {
          ...state[gameKey],
          active: gameKey === (game || {}).key,
        },
      };
    }, {});
  },
  [FETCH_MESSAGES]: {
    FULFILLED: (state, action) => {
      const gameKey = action.data.key;

      const {
        first,
        last,
      } = getFirstAndLastMessages(action.data.messages || [], state[gameKey]);

      return {
        ...state,
        [gameKey]: {
          ...state[gameKey],
          isLoadingEarlier: false,
          seen: {
            first,
            last,
          },
        },
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
            isLoadingEarlier: false,
            active: currentGame.active || false,
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
      return {
        ...state,
        [gameKey]: updateGameSeen(state, gameKey, {
          last: data.key,
        }),
      };
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, { data }) => {
      const gameKey = data.gameKey;
      const game = state[gameKey];
      return {
        ...state,
        [gameKey]: updateGameSeen(state, gameKey, {
          last: game.active ? data.key : game.seen.last,
        }),
      };
    },
  },
  [LOAD_EARLIER]: (state, { gameKey }) => {
    return {
      ...state,
      [gameKey]: {
        ...state[gameKey],
        isLoadingEarlier: true,
      },
    };
  },
}, initialState);
