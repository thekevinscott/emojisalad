import typeToReducer from 'type-to-reducer';

import Register from '../Register';
const {
  types,
} = Register;
const {
  SUBMIT_CLAIM,
} = types;

const initialState = {
  ui: {},
  data: {
    me: {
      id: null,
      blacklist: null,
      from: null,
      nickname: null,
      avatar: null,
      maximum_games: null,
      last_activity: null,
      created: null,
      archived: null,
      confirmed: null,
      confirmed_avatar: null,
      protocol: null,
    },
  },
};

export default typeToReducer({
  [SUBMIT_CLAIM]: {
    FULFILLED: (state, action) => {
      return {
        ...state,
        data: {
          ...state.data,
          me: action.payload,
        },
      };
    },
  },
}, initialState);
