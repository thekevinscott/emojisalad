import {
  UPDATE_DEVICE_TOKEN,
} from './types';

export function updateDeviceToken(deviceToken) {
  return dispatch => dispatch({
    type: UPDATE_DEVICE_TOKEN,
    deviceToken,
  });
}
