import { Actions } from 'react-native-router-flux';

import {
  update as updateLogger,
} from 'components/Logger/actions';

import {
  INVITE,
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
