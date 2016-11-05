import typeToReducer from 'type-to-reducer';

import {
  FETCH_GUESSES,
} from '../components/App/types';

const initialState = [];

export default typeToReducer({
  [FETCH_GUESSES]: {
    FULFILLED: (state, { payload }) => {
      return payload;
    },
  },
}, initialState);
