import {
  UPDATE_DEVICE_INFO,
} from './types';

export function updateDeviceInfo(info) {
  return {
    type: UPDATE_DEVICE_INFO,
    info,
  };
}
