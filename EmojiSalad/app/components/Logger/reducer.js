import typeToReducer from 'type-to-reducer';

import {
  UPDATE_LOGGER,
} from './types';

const initialState = {
  messages: [],
};

export default typeToReducer({
  [UPDATE_LOGGER]: (state, action) => ({
    ...state,
    messages: state.messages.concat(action.logger),
  }),
}, initialState);

