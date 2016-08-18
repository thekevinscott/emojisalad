import typeToReducer from 'type-to-reducer';

import {
  UPDATE_LOGGER,
} from './types';

const initialState = {
  logger: '',
};

export default typeToReducer({
  [UPDATE_LOGGER]: (state, action) => ({
    ...state,
    logger: action.logger,
  }),
}, initialState);

