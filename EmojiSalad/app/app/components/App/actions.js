import {
  UPDATE_DEVICE_TOKEN,
} from './types';

export function updateDeviceToken(token) {
  return {
    type: UPDATE_DEVICE_TOKEN,
    payload: {
      token,
    },
  };
}
