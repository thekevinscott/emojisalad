import {
  SUBMIT_CLAIM,
  MIGRATE_USER,
} from 'pages/Register/types';

import {
  FETCH_GAMES,
} from 'pages/Games/types';

import {
  SEND_MESSAGE,
  FETCH_MESSAGES,
  RECEIVE_MESSAGE,
} from 'pages/Game/types';

import {
  REQUEST_DEVICE_INFO,
  REQUEST_DEVICE_PUSH_ID,
  SEND_DEVICE_INFO,
  SEND_DEVICE_PUSH_ID,
} from 'middlewares/appqueueMiddleware/types';

import {
  HANDSHAKE,
} from '../types';

// TODO: How to keep this up to date with the server?
const TYPES = {
  [MIGRATE_USER]: 'MIGRATE_USER',
  [SUBMIT_CLAIM]: 'CLAIM',
  [SEND_MESSAGE]: 'SEND_MESSAGE',
  [FETCH_MESSAGES]: 'FETCH_MESSAGES',
  [RECEIVE_MESSAGE]: 'RECEIVE_MESSAGE',
  [FETCH_GAMES]: 'FETCH_GAMES',
  [REQUEST_DEVICE_INFO]: '@Device/REQUEST_DEVICE_INFO',
  [REQUEST_DEVICE_PUSH_ID]: '@Device/REQUEST_DEVICE_PUSH_ID',
  [SEND_DEVICE_INFO]: 'SEND_DEVICE_INFO',
  [SEND_DEVICE_PUSH_ID]: 'SEND_DEVICE_PUSH_ID',
  [HANDSHAKE]: 'HANDSHAKE',
};

export default Object.keys(TYPES).reduce((obj, type) => {
  const value = TYPES[type];
  return {
    ...obj,
    [`${type}_REJECTED`]: `${value}_REJECTED`,
    [`${type}_FULFILLED`]: `${value}_FULFILLED`,
  };
}, TYPES);
