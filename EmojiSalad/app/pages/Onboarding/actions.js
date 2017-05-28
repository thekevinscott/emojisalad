import {
  UPDATE_USER,
} from 'app/pages/Settings/types';

export const updateUser = (data, me) => {
  return {
    type: UPDATE_USER,
    payload: {
      data: {
        ...data,
        key: me.key,
        registered: true,
      },
    },
  };
};