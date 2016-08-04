import typeToReducer from 'type-to-reducer';

import {
  FETCH_GAMES,
} from '../Games/types';

import {
  INCREMENT_PAGE,
  UPDATE_COMPOSE,
  SEND_MESSAGE,
} from './types';

const DEFAULT_PAGE = 1;

function iterateOverGames(games, value) {
  return games.reduce((obj, game) => ({
    ...obj,
    [game.key]: value,
  }), {});
}

function getDefaultPages(data) {
  return iterateOverGames(data, DEFAULT_PAGE);
}

function getDefaultCompose(data) {
  return iterateOverGames(data, '');
}

const initialState = {
  compose: {},
  pages: {},
  sentMessages: {},
};

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => ({
      compose: {
        ...state.compose,
        ...getDefaultCompose(action.data),
      },
      pages: {
        ...getDefaultPages(action.data),
        ...state.pages,
      },
      sentMessages: {
        ...iterateOverGames(action.data, -1),
      },
    }),
  },
  [INCREMENT_PAGE]: (state, { gameKey }) => {
    return {
      compose: state.compose,
      pages: {
        ...state.pages,
        [gameKey]: state.pages[gameKey] + 1,
      },
      sentMessages: state.sentMessages,
    };
  },
  [UPDATE_COMPOSE]: (state, { gameKey, text }) => {
    return {
      pages: state.pages,
      compose: {
        ...state.compose,
        [gameKey]: text,
      },
      sentMessages: state.sentMessages,
    };
  },
  [SEND_MESSAGE]: {
    FULFILLED: (state, { data }) => {
      const gameKey = data.gameKey;
      return {
        pages: state.pages,
        compose: {
          ...state.compose,
          [gameKey]: '',
        },
        sentMessages: {
          ...state.sentMessages,
          [gameKey]: state.sentMessages[gameKey] + 1,
        },
      };
    },
  },
}, initialState);
