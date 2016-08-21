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
  REQUEST_DEVICE_TOKEN,
  SEND_DEVICE_INFO,
  SEND_DEVICE_TOKEN,
} from './types';

import deviceInfo from '../../../utils/device';

const APPQUEUE_REQUESTS = [
  REQUEST_DEVICE_INFO,
  REQUEST_DEVICE_TOKEN,
];

const getAppqueuePayload = type => {
  if (type === REQUEST_DEVICE_INFO) {
    return {
      type: SEND_DEVICE_INFO,
      payload: {
        info: deviceInfo,
      },
    };
  } else if (type === REQUEST_DEVICE_TOKEN) {
    return {
      type: SEND_DEVICE_TOKEN,
      payload: {
        token: 'foo',
      },
    };
  }

  return null;
};

const handleValidAppqueueRequest = (dispatch, type) => {
  if (APPQUEUE_REQUESTS.indexOf(type) !== -1) {
    const payload = getAppqueuePayload(type);
    dispatch({
      ...payload,
    });
  }
};

const appqueueMiddleware = ({ dispatch }) => next => action => {
  const {
    type,
  } = action;

  handleValidAppqueueRequest(dispatch, type);

  return next(action);
};

export default appqueueMiddleware;
