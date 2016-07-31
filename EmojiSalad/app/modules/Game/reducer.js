import typeToReducer from 'type-to-reducer';

import {
  FETCH_GAMES,
} from '../Games/types';

import {
  INCREMENT_PAGE,
} from './types';

const DEFAULT_PAGE = 1;

function getDefaultPages(data) {
  return data.reduce((obj, game) => ({
    ...obj,
    [game.key]: DEFAULT_PAGE,
  }), {});
}

const initialState = {
};

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => ({
      pages: {
        ...getDefaultPages(action.data),
        ...state.pages,
      },
    }),
  },
  [INCREMENT_PAGE]: (state, { gameKey }) => {
    return {
      pages: {
        ...state.pages,
        [gameKey]: state.pages[gameKey] + 1,
      },
    };
  },
}, initialState);

