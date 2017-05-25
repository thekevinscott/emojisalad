import typeToReducer from 'type-to-reducer';

import {
  LOGIN,
} from './types';

const initialState = {
  user: null,
};

export default typeToReducer({
  [LOGIN]: {
    FULFILLED: (state, action) => {
      //console.log('action', action);
      const user = action.data;
      return {
        ...state,
        user,
      };
    },
    REJECTED: (state, action) => {
      console.log('action', action);
      //const DEFAULT_ERROR = 'There was an unknown error: ' + JSON.stringify(action);
      //const error = (action.data || {}).message || DEFAULT_ERROR;
      return {
        ...state,
      };
    },
  },
}, initialState);
