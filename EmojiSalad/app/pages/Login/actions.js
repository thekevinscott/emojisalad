import { Actions } from 'react-native-router-flux';

import {
  LOGIN,
} from './types';

export const login = (data) => dispatch => {
  return dispatch({
    type: LOGIN,
    payload: {
      data,
    },
  });
};

export const next = user => {
  if (user.registered) {
    Actions.games();
  } else {
    Actions.onboarding();
  }
};
