import {
  sendMessage,
} from '../../../utils/Api/websocket';

import {
  updateStatus,
} from '../../../utils/Api/websocket/actions';

import {
  HANDSHAKE,
} from './types';

const websocketMiddleware = ({
  getState,
  dispatch,
}) => next => action => {
  const {
    payload,
    type,
    meta,
    ...rest,
  } = action;

  if (type === HANDSHAKE) {
    console.log('*** got the handshake');
    dispatch(updateStatus(true));
  }

  if (!payload) {
    return next(action);
  }

  const PENDING = `${type}_PENDING`;

  const userKey = getState().data.me.key;
  sendMessage({
    userKey,
    type,
    payload,
    meta,
  });

  // continue on through the middleware stack
  return next({
    ...rest,
    type: PENDING,
    payload,
    meta,
  });
};

export default websocketMiddleware;
