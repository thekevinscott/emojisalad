import typeToReducer from 'type-to-reducer';

import {
  START_NEW_GAME,
} from './types';

const initialState = {
  pending: false,
};

export default typeToReducer({
  [START_NEW_GAME]: {
    PENDING: state => {
      return {
        ...state,
        pending: true,
      };
    },
    FULFILLED: state => {
      return {
        ...state,
        pending: false,
      };
    },
  },
}, initialState);
