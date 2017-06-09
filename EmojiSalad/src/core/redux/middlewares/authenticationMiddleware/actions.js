import {
  LOCAL_LOGIN,
  LOCAL_LOGOUT,
  SERVER_LOGIN,
} from './types';

export const localLogin = credentials => dispatch => {
  return dispatch({
    type: LOCAL_LOGIN,
    credentials,
  });
};

export const localLogout = () => dispatch => {
  return dispatch({
    type: LOCAL_LOGOUT,
  });
};

export const serverLogin = (data) => dispatch => {
  if (data) {
    return dispatch({
      type: SERVER_LOGIN,
      payload: {
        data,
      },
    });
  }
};
