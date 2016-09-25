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
    //console.log('*** got the handshake');
    dispatch(updateStatus(true));
  }

  if (!payload) {
    //console.log('there is no payload, move to next action');
    return next(action);
  }

  const PENDING = `${type}_PENDING`;
  const REJECTED = `${type}_REJECTED`;

  const userKey = getState().data.me.key;
  sendMessage({
    userKey,
    type,
    payload,
    meta,
  }).catch(() => {
    console.log('here is a catch', REJECTED);
    dispatch({
      ...rest,
      type: REJECTED,
      meta,
    });
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
