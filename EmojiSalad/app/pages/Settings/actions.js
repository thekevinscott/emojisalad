import {
  UPDATE_USER,
} from './types';

import {
  LOCAL_LOGOUT,
} from 'components/Authentication/types';

export const updateSettings = (data, me) => {
  return {
    type: UPDATE_USER,
    payload: {
      data: {
        ...data,
        key: me.key,
      },
    },
  };
};

export const logout = () => {
  return {
    type: LOCAL_LOGOUT,
  };
};
