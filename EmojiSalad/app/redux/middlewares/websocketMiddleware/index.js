import sendMessage from './utils/sendMessage';
import onMessage from './utils/onMessage';
import io from './socketio';
import {
  API_PORT,
  API_HOST,
} from '../../../../config';

import {
  updateStatus,
} from './actions';

let socket;
const bootstrapSocket = (dispatch) => {
  socket = io(`${API_HOST}:${API_PORT}`, {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    //console.log('connected!');
    dispatch(updateStatus(true));
  });

  socket.on('disconnect', () => {
    //console.log('disconnected!');
    dispatch(updateStatus(false));
  });

  socket.on('message', onMessage(dispatch));
};

const websocketMiddleware = ({
  getState,
  dispatch,
}) => next => action => {
  if (!socket) {
    bootstrapSocket(dispatch);
  }

  const connected = getState().application.connection.connected;

  const {
    payload,
    type,
    meta,
    ...rest,
  } = action;

  if (!payload) {
    //console.log('there is no payload, move to next action');
    return next(action);
  }

  const PENDING = `${type}_PENDING`;
  const REJECTED = `${type}_REJECTED`;

  const userKey = getState().data.me.key;
  if (connected) {
    const packet = sendMessage(socket, {
      userKey,
      type,
      payload,
      meta,
    }, () => {
      dispatch({
        ...rest,
        type: REJECTED,
        data: {
          message: 'Failed to reach the server',
        },
        meta,
      });
    });
    const messageId = packet.meta.id;
    console.log('sent message id', messageId);
  } else {
    return next({
      ...rest,
      type: REJECTED,
      data: {
        message: 'Server is not connected',
      },
      payload,
      meta,
    });
  }

  // continue on through the middleware stack
  return next({
    ...rest,
    type: PENDING,
    payload,
    meta,
  });
};

export default websocketMiddleware;
