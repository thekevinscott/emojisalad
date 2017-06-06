import typeToReducer from 'type-to-reducer';

import {
  UPDATE_USER,
} from 'pages/Settings/types';

const initialState = {
  pending: false,
};

export default typeToReducer({
  [UPDATE_USER]: {
    PENDING: (state) => {
      return {
        ...state,
        pending: true,
      };
    },
    FULFILLED: (state) => {
      return {
        ...state,
        pending: false,
      };
    },
  },
}, initialState);
