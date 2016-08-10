import {
  SUBMIT_CLAIM,
  MIGRATE_USER,
} from '../../../modules/Register/types';

import {
  FETCH_GAMES,
} from '../../../modules/Games/types';

import {
  SEND_MESSAGE,
  FETCH_MESSAGES,
  RECEIVE_MESSAGE,
} from '../../../modules/Game/types';

// TODO: How to keep this up to date with the server?
const TYPES = {
  [MIGRATE_USER]: 'MIGRATE_USER',
  [SUBMIT_CLAIM]: 'CLAIM',
  [SEND_MESSAGE]: 'SEND_MESSAGE',
  [FETCH_MESSAGES]: 'FETCH_MESSAGES',
  [RECEIVE_MESSAGE]: 'RECEIVE_MESSAGE',
  [FETCH_GAMES]: 'FETCH_GAMES',
};

export default Object.keys(TYPES).reduce((obj, type) => {
  const value = TYPES[type];
  return {
    ...obj,
    [`${type}_REJECTED`]: `${value}_REJECTED`,
    [`${type}_FULFILLED`]: `${value}_FULFILLED`,
  };
}, TYPES);
