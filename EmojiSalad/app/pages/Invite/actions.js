import { Actions } from 'react-native-router-flux';

import {
  update as updateLogger,
} from 'components/Logger/actions';

import {
  FB_API,
} from 'middlewares/networkMiddleware/types';

import {
  INVITE,
  GET_USER_FRIENDS,
} from './types';

export const invite = (userKey, gameKey, phones) => dispatch => dispatch(() => {
  dispatch(updateLogger(`invite user key: ${userKey} and gameKey: ${gameKey} and phones: ${JSON.stringify(phones)}`));

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

export const getUserFriends = (token) => dispatch => dispatch(() => {
  return dispatch({
    type: FB_API,
    meta: {
      type: GET_USER_FRIENDS,
    },
    payload: {
      token,
      path: [
        'me/friends',
        'me/invitable_friends',
      ],
    },
  });
});
