import typeToReducer from 'type-to-reducer';

import {
  FETCH_GUESSES,
} from '../components/App/types';

import {
  RECEIVED_MESSAGE,
} from '../store/middleware/websocket/types';

const initialState = [];

export default typeToReducer({
  [FETCH_GUESSES]: {
    FULFILLED: (state, { payload }) => {
      return payload;
    },
  },
  [RECEIVED_MESSAGE]: (state, action) => {
    return state.concat(action.data);
  },
}, initialState);
