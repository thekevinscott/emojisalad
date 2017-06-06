import typeToReducer from 'type-to-reducer';

import {
  ActionConst,
} from 'react-native-router-flux';

import {
  FETCH_GAMES,
  OPEN_GAME,
  UPDATE_STARTING_MESSAGE,
} from './types';

import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
} from '../Game/types';

import mapState from './utils/mapState';

const initialState = {
  fetching: true,
  error: false,
  logger: '',
  games: {},
  active: false,
};

const getActive = (name) => {
  return name === 'games';
};

const setStartingMessage = (game, key) => ({
  startingMessage: key,
});

export default typeToReducer({
  [OPEN_GAME]: (state, { games }) => ({
    ...state,
    games: games.reduce((obj, game) => {
      const messageKey = ((game.messages || [])[0] || {}).key;
      return {
        ...obj,
        [game.key]: setStartingMessage(game, messageKey),
      };
    }, {}),
  }),
  [ActionConst.FOCUS]: (state, { scene }) => {
    if (scene) {
      return {
        ...state,
        active: getActive(scene.name),
      };
    }

    return state;
  },
  [UPDATE_STARTING_MESSAGE]: (state, { game }) => {
    const message = game.messages[game.messages.length - 1];
    return {
      ...state,
      games: {
        ...state.games,
        [game.key]: setStartingMessage(game, (message || {}).key),
      },
    };
  },
  [FETCH_GAMES]: {
    PENDING: (state) => ({
      ...state,
      fetching: true,
      error: false,
    }),
    FULFILLED: (state, { data }) => {
      return {
        ...state,
        games: data.reduce((obj, el) => {
          if (el.type === 'invite') {
            const game = el.game;
            return {
              ...obj,
              [game.key]: setStartingMessage(game, (el.messages[0] || []).key),
            };
          }

          const game = el;
          return {
            ...obj,
            [game.key]: setStartingMessage(game, (game.messages[0] || []).key),
          };
        }, {}),
        fetching: false,
        error: false,
      };
    },
    REJECTED: (state, action) => {
      return {
        ...state,
        fetching: false,
        error: action.data.message || true,
      };
    },
  },
  [SEND_MESSAGE]: {
    FULFILLED: (state, { data: message }) => {
      return {
        ...state,
        games: mapState(state.games, (game, gameKey) => {
          if (gameKey === message.gameKey) {
            return setStartingMessage(game, message.key);
          }

          return game;
        }),
      };
    },
  },
  [RECEIVE_MESSAGE]: {
    FULFILLED: (state, { data: message }) => {
      const active = state.active;
      if (active) {
        return {
          ...state,
        };
      }

      return {
        ...state,
        games: mapState(state.games, (game, gameKey) => {
          if (gameKey === message.gameKey) {
            return setStartingMessage(game, message.key);
          }

          return game;
        }),
      };
    },
  },
  UPDATE_LOGGER: (state, action) => ({
    ...state,
    logger: action.logger,
  }),
}, initialState);
