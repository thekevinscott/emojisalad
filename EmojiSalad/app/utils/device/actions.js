import {
  UPDATE_DEVICE_INFO,
} from './types';

import INFO from './info';

export function updateDeviceInfo() {
  return {
    type: UPDATE_DEVICE_INFO,
    info: INFO,
  };
}
