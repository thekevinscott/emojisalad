import {
  SAVE_PUSH_ID,
} from './types';

export const savePushId = (pushToken, pushId) => {
  return {
    type: SAVE_PUSH_ID,
    pushToken,
    pushId,
  };
};

