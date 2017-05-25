import typeToReducer from 'type-to-reducer';

import {
  UPDATE_USER,
} from 'app/pages/Onboarding/types';

const initialState = {
  saved: false,
};

export default typeToReducer({
  [UPDATE_USER]: {
    FULFILLED: (state) => {
      return {
        ...state,
        saved: true,
      };
    },
  },
}, initialState);
