import typeToReducer from 'type-to-reducer';

import {
  ActionConst,
} from 'react-native-router-flux';

import {
  FETCH_GAMES,
  OPEN_GAME,
} from './types';

import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
} from '../Game/types';

import mapState from './utils/mapState';

const initialState = {
  fetching: true,
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
    games: games.reduce((obj, game) => ({
      ...obj,
      [game.key]: setStartingMessage(game, game.messages[0].key),
    }), {}),
  }),
  [ActionConst.FOCUS]: (state, { scene }) => ({
    ...state,
    active: getActive(scene.name),
  }),
  [FETCH_GAMES]: {
    FULFILLED: (state, { data }) => ({
      ...state,
      games: data.reduce((obj, game) => ({
        ...obj,
        [game.key]: setStartingMessage(game, game.messages[0].key),
      }), {}),
      fetching: false,
    }),
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
