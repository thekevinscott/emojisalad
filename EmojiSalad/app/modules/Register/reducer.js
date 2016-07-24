import typeToReducer from 'type-to-reducer';

import {
  SUBMIT_CLAIM,
  UPDATE_TEXT,
} from './types';

const initialState = {
  text: '',
  claiming: false,
  error: '',
};

export default typeToReducer({
  [SUBMIT_CLAIM]: {
    PENDING: (state) => {
      return {
        ...state,
        error: '',
        claiming: true,
      };
    },
    FULFILLED: (state, action) => {
      //console.log('wussup', action.payload);
      return {
        ...state,
        claiming: false,
      };
    },
    REJECTED: (state, action) => {
      console.log('rejected', action.data.message);
      return {
        ...state,
        error: action.data.message,
        claiming: false,
      };
    },
  },
  [UPDATE_TEXT]: (state, action) => {
    return {
      ...state,
      error: '',
      text: action.text,
    };
  },
}, initialState);
