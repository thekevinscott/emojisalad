import typeToReducer from 'type-to-reducer';

import {
  SUBMIT_CLAIM,
  UPDATE_TEXT,
  MIGRATE_USER,
} from './types';

const initialState = {
  text: '',
  claiming: false,
  error: '',
  success: '',
  migration: null,
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
        user: action.data,
        claiming: false,
        migration: 'pending',
      };
    },
    REJECTED: (state, action) => {
      console.log('action', action);
      const DEFAULT_ERROR = 'There was an unknown error';
      const error = (action.data || {}).message || DEFAULT_ERROR;
      //action.data.message);
      return {
        ...state,
        error,
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
  [MIGRATE_USER]: {
    FULFILLED: (state) => {
      return {
        ...state,
        migration: 'complete',
      };
    },
  },
}, initialState);
