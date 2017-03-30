import typeToReducer from 'type-to-reducer';

import {
  UPDATE_LOGGER,
} from './types';

const initialState = {
  messages: [],
};

const sliceNMessages = (n, messages) => {
  const index = messages.length - n > 0 ? messages.length - n : 0;
  return messages.slice(index);
};

const getNMessages = (n, messages, { logger: message }) => {
  return sliceNMessages(n - 1, messages).concat({
    message,
    timestamp: new Date(),
  });
};

export default typeToReducer({
  [UPDATE_LOGGER]: (state, action) => ({
    ...state,
    messages: getNMessages(4, state.messages, action),
  }),
}, initialState);

