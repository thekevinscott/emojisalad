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
  [SUBMIT_CLAIM]: (state) => {
    console.log('submit claim!');
    return {
      ...state,
      error: '',
      claiming: true,
    };
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
