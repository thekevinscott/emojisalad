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

const getEmptyGame = (game = {}) => ({
  active: game.active || false,
  compose: game.compose || '',
  seen: {
    first: (game.seen || {}).first || null,
    last: (game.seen || {}).last || null,
  },
  sending: false,
  loading: game.loading || false,
  error: game.error || false,
  updated: new Date(),
});

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

const setActiveGame = (state, game) => {
  return Object.keys(state).reduce((obj, gameKey) => ({
    ...obj,
    [gameKey]: {
      ...getEmptyGame(),
      ...state[gameKey],
      active: gameKey === (game || {}).key,
    },
  }), {});
};

const updateGame = (state, gameKey, payload = {}) => ({
  ...state,
  [gameKey]: {
    ...state[gameKey],
    ...payload,
  },
});

export default typeToReducer({
  [ActionConst.FOCUS]: (state, { scene }) => {
    if (scene) {
      return setActiveGame(state, scene.game);
    }

    return state;
  },
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => ({
      ...state,
      ...action.data.reduce((obj, { key }) => ({
        ...obj,
        [key]: {
          ...getEmptyGame(state[key]),
        },
      }), {}),
    }),
  },
  [FETCH_MESSAGES]: {
    PENDING: (state, { meta }) => {
      return updateGame(state, meta.gameKey, {
        loading: true,
        error: false,
      });
    },
    FULFILLED: (state, action) => {
      const gameKey = action.data.key;

      const {
        first,
        last,
      } = getFirstAndLastMessages(action.data.messages || [], state[gameKey]);

      return updateGame(state, action.data.key, {
        updated: new Date(),
        loading: false,
        error: false,
        seen: {
          first,
          last,
        },
      });
    },
    REJECTED: (state, action) => {
      if (action.meta.gameKey) {
        return updateGame(state, action.meta.gameKey, {
          loading: false,
          error: true,
        });
      }

      return state;
    },
  },
  [UPDATE_COMPOSE]: (state, { gameKey, text }) => {
    return updateGame(state, gameKey, {
      compose: text,
    });
  },
  [SEND_MESSAGE]: {
    PENDING: (state, { payload }) => {
      return updateGame(state, payload.gameKey, {
        sending: true,
        error: false,
        compose: '',
      });
    },
    FULFILLED: (state, { data }) => {
      const gameKey = data.gameKey;
      return updateGame(state, gameKey, {
        sending: false,
        error: false,
        compose: '',
        seen: {
          ...state[gameKey].seen,
          updated: new Date(),
          last: data.key,
        },
      });
    },
    REJECTED: (state, { meta }) => {
      const gameKey = meta.gameKey;
      return updateGame(state, gameKey, {
        sending: false,
        error: true,
      });
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, { data }) => {
      const gameKey = data.gameKey;
      const game = state[gameKey] || {};

      return updateGame(state, gameKey, {
        seen: {
          ...(state[gameKey] || {}).seen,
          updated: new Date(),
          last: game.active ? data.key : (game.seen || {}).last,
        },
      });
    },
  },
  [LOAD_EARLIER]: (state, { gameKey }) => {
    return updateGame(state, gameKey, {
      loading: true,
    });
  },
}, initialState);
