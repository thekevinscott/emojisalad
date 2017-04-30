/*
 * This provides a wrapper for the appqueue service to make
 * requests programmatically for data from the app.
 *
 * For instance, the server might notice that a device token
 * is missing, or device info; on the next request, the server
 * can execute a request for that info, and the device
 * can respond appropriately.
 *
 */

import {
  REQUEST_DEVICE_INFO,
  REQUEST_DEVICE_PUSH_ID,
} from './types';

import {
  sendDeviceInfo,
  sendDevicePushId,
} from './actions';

const APPQUEUE_REQUESTS = [
  REQUEST_DEVICE_INFO,
  REQUEST_DEVICE_PUSH_ID,
];

const getAppqueuePayload = (type, state) => {
  if (type === REQUEST_DEVICE_INFO) {
    return sendDeviceInfo(state);
  } else if (type === REQUEST_DEVICE_PUSH_ID) {
    return sendDevicePushId(state);
  }

  return null;
};

const handleValidAppqueueRequest = (dispatch, state, type) => {
  if (APPQUEUE_REQUESTS.indexOf(type) !== -1) {
    const payload = getAppqueuePayload(type, state);
    dispatch({
      ...payload,
    });
  }
};

const appqueueMiddleware = ({
  dispatch,
  getState,
}) => next => action => {
  const {
    type,
  } = action;

  handleValidAppqueueRequest(dispatch, getState(), type);

  return next(action);
};

export default appqueueMiddleware;
