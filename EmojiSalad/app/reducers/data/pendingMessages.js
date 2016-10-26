import typeToReducer from 'type-to-reducer';

import {
  SEND_MESSAGE,
} from '../../modules/Game/types';

const initialState = [];

export default typeToReducer({
  [SEND_MESSAGE]: {
    PENDING: (state, { payload, meta }) => {
      const {
        gameKey,
        userKey,
        message,
      } = payload;

      const pendingKey = meta.pendingKey;

      return {
        ...state,
        [pendingKey]: {
          key: pendingKey,
          pendingKey,
          body: message.body,
          gameKey,
          userKey,
          timestamp: (new Date()).getTime(),
          type: 'pending',
        },
      };
    },
    FULFILLED: (state) => {
      return state;
      //return buildMessageObj(state, [action.data]);
    },
  },
}, initialState);

