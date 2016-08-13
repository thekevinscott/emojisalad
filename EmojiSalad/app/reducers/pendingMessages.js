import typeToReducer from 'type-to-reducer';

import {
  SEND_MESSAGE,
} from '../modules/Game/types';

const initialState = [];

export default typeToReducer({
  [SEND_MESSAGE]: {
    PENDING: (state, { payload, meta }) => {
      const {
        gameKey,
        userKey,
        message,
      } = payload;

      const temporaryKey = meta.temporaryKey;

      return {
        ...state,
        [temporaryKey]: {
          key: temporaryKey,
          temporaryKey,
          body: message.body,
          gameKey,
          userKey,
          timestamp: (new Date()).getTime() / 1000,
          type: 'received',
        },
      };
    },
    FULFILLED: (state) => {
      return state;
      //return buildMessageObj(state, [action.data]);
    },
  },
}, initialState);

