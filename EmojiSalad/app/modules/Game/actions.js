import Api from '../../utils/Api';

import {
  FETCH_MESSAGES,
} from './types';

export function fetchMessages(gameId) {
  return {
    type: FETCH_MESSAGES,
    payload: Api.socketSend({
      type: FETCH_MESSAGES,
      userId: 23,
    }),
  };
}
