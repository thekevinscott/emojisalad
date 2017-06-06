import { Actions } from 'react-native-router-flux';

import {
  UPDATE_USER,
} from 'pages/Settings/types';

export const updateUser = (data, me) => dispatch => {
  return dispatch({
    type: UPDATE_USER,
    payload: {
      data: {
        ...data,
        key: me.key,
        registered: true,
      },
    },
  }).then(() => {
    Actions.games();
  });
};
