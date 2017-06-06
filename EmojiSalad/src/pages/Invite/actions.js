import { Actions } from 'react-native-router-flux';

import {
  INVITE,
  //GET_USER_FRIENDS,
} from './types';

export const invite = (userKey, gameKey, phones) => dispatch => dispatch(() => {

  Actions.pop();

  return dispatch({
    type: INVITE,
    payload: {
      userKey,
      gameKey,
      phones,
    },
  });
});
