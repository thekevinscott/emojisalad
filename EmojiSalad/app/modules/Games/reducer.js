import typeToReducer from 'type-to-reducer';

import {
  FETCH_GAMES,
} from './types';

const initialState = {
  fetching: true,
};

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state) => ({
      ...state,
      fetching: false,
    }),
  },
  UPDATE_LOGGER: (state, action) => {
    return {
      ...state,
      logger: action.logger,
    };
  },
}, initialState);
