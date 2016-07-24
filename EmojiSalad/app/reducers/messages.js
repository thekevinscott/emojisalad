import typeToReducer from 'type-to-reducer';

// TODO: Fix this import (should pull from index)
import {
  FETCH_MESSAGES,
} from '../modules/Game/types';

const initialState = {
  received: {},
  sent: {},
};

const getMessage = (message) => {
  return {
    id: message.id,
    body: message.body,
    from: message.from,
    sender: message.sender,
    to: message.to,
    timestamp: message.timestamp,
    type: message.type,
  };
};

const getMessagesByType = (type, messages) => {
  return messages.filter(message => {
    return message.type === type;
  }).map(message => {
    return message;
  }).reduce((obj, message) => ({
    ...obj,
    [message.id]: getMessage(message),
  }), {});
};

export default typeToReducer({
  [FETCH_MESSAGES]: {
    FULFILLED: (state, action) => {
      return [
        'sent',
        'received',
      ].reduce((obj, type) => {
        return {
          ...obj,
          [type]: {
            ...state[type],
            ...getMessagesByType(type, action.payload),
          },
        };
      }, {});
    },
  },
}, initialState);

