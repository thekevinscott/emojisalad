import {
  SEND_DEVICE_INFO,
  SEND_DEVICE_TOKEN,
} from './types';

import getDeviceInfo from './utils/getDeviceInfo';
import getDeviceToken from './utils/getDeviceToken';

export function sendDeviceInfo(state) {
  return {
    type: SEND_DEVICE_INFO,
    payload: {
      device_info: getDeviceInfo(state),
    },
  };
}

export function sendDeviceToken(state) {
  return {
    type: SEND_DEVICE_TOKEN,
    payload: {
      device_token: getDeviceToken(state),
    },
  };
}
