import Api from '../../utils/Api';

import {
  SUBMIT_CLAIM,
  UPDATE_TEXT,
} from './types';

export function submitClaim(text) {
  return {
    type: SUBMIT_CLAIM,
    text,
    payload: Api.fetch('claim', {
      method: 'post',
      body: {
        text,
      },
    }),
  };
}

export function updateText(text) {
  return {
    type: UPDATE_TEXT,
    text,
  };
}
