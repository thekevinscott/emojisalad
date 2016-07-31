import {
  SUBMIT_CLAIM,
} from '../../../modules/Register/types';
import {
  SEND_MESSAGE,
  FETCH_MESSAGES,
} from '../../../modules/Game/types';

// TODO: How to keep this up to date with the server?
const TYPES = {
  [SUBMIT_CLAIM]: 'CLAIM',
  [SEND_MESSAGE]: 'SEND_MESSAGE',
  [FETCH_MESSAGES]: 'FETCH_MESSAGES',
};

export default Object.keys(TYPES).reduce((obj, type) => {
  const value = TYPES[type];
  return {
    ...obj,
    [`${type}_REJECTED`]: `${value}_REJECTED`,
    [`${type}_FULFILLED`]: `${value}_FULFILLED`,
  };
}, TYPES);
