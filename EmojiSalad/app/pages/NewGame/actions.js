import { Actions } from 'react-native-router-flux';
import {
  update as updateLogger,
} from 'components/Logger/actions';

import {
  INVITE_PHONE,
  REMOVE_PHONE,
  START_NEW_GAME,
} from './types';

export const invitePhoneNumber = phone => {
  return {
    type: INVITE_PHONE,
    phone,
  };
};

export const removePhoneNumber = player => {
  return {
    type: REMOVE_PHONE,
    player,
  };
};

export const startGame = (userKey, phones) => dispatch => dispatch(() => {
  Actions.pop();

  dispatch(updateLogger(`start new game with user key: ${userKey} and phones: ${JSON.stringify(phones)}`));

  return dispatch({
    type: START_NEW_GAME,
    payload: {
      userKey,
      phones,
    },
  });
});
