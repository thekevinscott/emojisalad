import typeToReducer from 'type-to-reducer';

import {
  LOCAL_LOGIN,
  LOCAL_LOGOUT,
  SERVER_LOGIN,
} from 'core/redux/middlewares/authenticationMiddleware/types';

const initialState = {
  pending: false,
  credentials: null,
  isLoggedIn: null,
};

export default typeToReducer({
  [LOCAL_LOGIN]: (state, { credentials }) => {
    return {
      ...state,
      credentials, 
      isLoggedIn: true,
    };
  },
  [LOCAL_LOGOUT]: (state) => {
    return {
      ...state,
      credentials: null, 
      isLoggedIn: false,
    };
  },
  [SERVER_LOGIN]: {
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
    REJECTED: (state, action) => {
      console.log('action', action);
      return {
        pending: false,
        ...state,
      };
    },
  },
}, initialState);


