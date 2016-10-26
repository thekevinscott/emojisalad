import typeToReducer from 'type-to-reducer';

import {
  UPDATE_STATUS,
} from '../../redux/middlewares/websocketMiddleware/types';

const initialState = {
  connected: false,
  lastConnected: null,
};

export default typeToReducer({
  [UPDATE_STATUS]: (state, { status }) => {
    if (status) {
      return {
        ...state,
        connected: true,
        lastConnected: new Date(),
      };
    }

    return {
      ...state,
      connected: false,
    };
  },
}, initialState);

