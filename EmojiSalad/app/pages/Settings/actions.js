import {
  UPDATE_USER,
} from './types';

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
