import {
  SEND_DEVICE_INFO,
  SEND_DEVICE_PUSH_ID,
} from './types';

import getDeviceInfo from './utils/getDeviceInfo';
import getDevicePushId from './utils/getDevicePushId';

export function sendDeviceInfo(state) {
  return {
    type: SEND_DEVICE_INFO,
    payload: {
      device_info: getDeviceInfo(state),
    },
  };
}

export function sendDevicePushId(state) {
  return {
    type: SEND_DEVICE_PUSH_ID,
    payload: {
      ...getDevicePushId(state),
    },
  };
}
