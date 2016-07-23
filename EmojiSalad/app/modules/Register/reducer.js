import typeToReducer from 'type-to-reducer';

import {
  SUBMIT_CLAIM,
  UPDATE_TEXT,
  UPDATE_ERROR,
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
      return {
        ...state,
        claiming: false,
      };
    },
    REJECTED: (state, action) => {
      return {
        ...state,
        error: action.payload.message,
        claiming: false,
      };
    },
  },
  [UPDATE_TEXT]: (state, action) => {
    console.log('update text');
    return {
      ...state,
      error: '',
      text: action.text,
    };
  },
  [UPDATE_ERROR]: (state, action) => {
    console.log('update error', action);
    return {
      ...state,
      claiming: false,
      error: action.error,
    };
  },
}, initialState);
