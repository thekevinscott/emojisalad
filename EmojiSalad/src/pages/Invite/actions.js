import {
  INVITE,
  //GET_USER_FRIENDS,
} from './types';

export const invite = (userKey, gameKey, phones) => dispatch => dispatch(() => {
  return dispatch({
    type: INVITE,
    payload: {
      userKey,
      gameKey,
      phones,
    },
  });
});
