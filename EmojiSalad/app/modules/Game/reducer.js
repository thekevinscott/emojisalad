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
  loading: game.loading || false,
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

const updateGameSeen = (state, gameKey, payload = {}) => {
  return {
    ...state,
    [gameKey]: {
      ...state[gameKey],
      compose: '',
      seen: {
        ...state[gameKey].seen,
        ...payload,
      },
    },
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
    return setActiveGame(state, scene.game);
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
        seen: {
          first,
          last,
        },
      });
    },
    REJECTED: (state, { meta }) => {
      return updateGame(state, meta.gameKey, {
        loading: false,
      });
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
        compose: '',
      });
    },
    FULFILLED: (state, { data }) => {
      return updateGameSeen(state, data.gameKey, {
        updated: new Date(),
        last: data.key,
      });
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, { data }) => {
      const gameKey = data.gameKey;
      const game = state[gameKey];
      return updateGameSeen(state, gameKey, {
        updated: new Date(),
        last: game.active ? data.key : game.seen.last,
      });
    },
  },
  [LOAD_EARLIER]: (state, { gameKey }) => {
    return updateGame(state, gameKey, {
      loading: true,
    });
  },
}, initialState);
