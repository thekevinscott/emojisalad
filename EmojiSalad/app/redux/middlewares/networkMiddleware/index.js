/* globals Promise */
import sendMessage from './utils/sendMessage';
import onMessage from './utils/onMessage';
import io from './socketio';
import {
  API_PORT,
  API_HOST,
} from 'config';

import {
  updateStatus,
} from './actions';

import lib, { WEBSOCKET } from './lib';

const promises = {};
let socket;
const bootstrapSocket = (dispatch) => {
  socket = io(`${API_HOST}:${API_PORT}`, {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('**** connected!');
    dispatch(updateStatus(true));
  });

  socket.on('disconnect', () => {
    console.log('**** disconnected!');
    dispatch(updateStatus(false));
  });

  socket.on('message', e => {
    const payload = onMessage(e);
    dispatch(payload);
    if (payload.meta && payload.meta.id && promises[payload.meta.id]) {
      const promise = promises[payload.meta.id];
      if (payload.type.indexOf('_REJECTED') !== -1) {
        console.log('throw error for', payload);
        promise.reject(payload);
      } else {
        console.log('resolve payload for', payload);
        promise.resolve(payload);
      }
    }
  });
};

const websocket = ({
  userKey,
  connected,
  type,
  payload,
  meta,
  params,
}, {
  dispatch,
  next,
}, types) => {
  if (!connected) {
    console.log('websocket is not connected and thus will be rejected for', types.REJECTED);
    return next({
      ...params,
      type: types.REJECTED,
      data: {
        message: 'Server is not connected',
      },
      payload,
      meta,
    });
  } else {
    const packet = sendMessage(socket, {
      userKey,
      type,
      payload,
      meta,
    }, () => {
      console.log('this is from the secon arg to send message', types.REJECTED);
      dispatch({
        ...params,
        type: types.REJECTED,
        data: {
          message: 'Failed to reach the server',
        },
        meta,
      });
    });

    const messageId = packet.meta.id;
    console.log('sent message id', messageId);
    return messageId;
  }
};

const rest = ({
  type,
  payload,
  meta,
  params,
}, {
  dispatch,
}, types) => {
  const url = `${API_HOST}:${API_PORT}/${payload.route}`;

  fetch(url, {
    method: payload.method || 'get',
    payload,
    meta,
    ...params,
  }).then(response => response.json()).then(response => {
    dispatch({
      type: types.FULFILLED,
      data: response,
      meta,
      ...params,
    });
  }).catch(err => {
    dispatch({
      type: types.REJECTED,
      err,
    });
  });
};

const getConnectedStatus = (getState, count = 0) => {
  const {
    application: {
      connection: {
        connected,
      },
    },
  } = getState();

  if (connected || count >= 59) {
    return Promise.resolve(connected);
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(getConnectedStatus(getState, count + 1));
    }, 1000);
  });
};

const networkMiddleware = ({
  getState,
  dispatch,
}) => next => action => {
  if (!socket) {
    bootstrapSocket(dispatch);
  }

  const {
    payload,
    type,
    meta,
    ...params,
  } = action;

  if (!payload) {
    return next(action);
  }

  const types = {
    PENDING: `${type}_PENDING`,
    FULFILLED: `${type}_FULFILLED`,
    REJECTED: `${type}_REJECTED`,
  };

  const fns = {
    next,
    dispatch,
  };

  next({
    ...params,
    type: types.PENDING,
    payload,
    meta,
  });

  // all websocket, all the time
  if (lib[type] === WEBSOCKET || 1) {
    return getConnectedStatus(getState).then(connected => {
      const {
        data,
      } = getState();

      const args = [
        {
          userKey: data.me.key,
          connected,
          type,
          payload,
          meta,
          params,
        },
        fns,
        types,
      ];

      const messageId = websocket(...args);

      const promiseObj = {
        reject: null,
        resolve: null,
      };
      const promise = new Promise((resolve, reject) => {
        promiseObj.reject = reject;
        promiseObj.resolve = resolve;
      });

      promises[messageId] = {
        promise,
        ...promiseObj,
      };

      return promises[messageId].promise;
    });
  } else {
    // otherwise, fetch it
    rest({
      type,
      payload,
      meta,
      params,
    }, fns, types);
  }

};

export default networkMiddleware;
