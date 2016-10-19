import typeToReducer from 'type-to-reducer';
import {
  ActionConst,
} from 'react-native-router-flux';

import {
  STATUS_UPDATE,
  ATTEMPT_CONNECTION,
} from '../utils/Api/websocket/types';

const initialState = {
  scene: {
    name: 'games',
    key: 'games',
    title: 'Games',
  },
  websocket: {
    connected: false,
    attempts: 0,
  },
};

export default typeToReducer({
  [ActionConst.FOCUS]: (state, { scene }) => ({
    ...state,
    scene: {
      name: scene.name,
      key: scene.sceneKey,
      title: scene.title,
    },
  }),
  [STATUS_UPDATE]: (state, { connected }) => {
    const attempts = connected ? 0 : state.websocket.attempts;

    return {
      ...state,
      websocket: {
        ...state.websocket,
        connected: connected ? new Date() : false,
        attempts,
      },
    };
  },
  [ATTEMPT_CONNECTION]: (state) => ({
    ...state,
    websocket: {
      ...state.websocket,
      attempts: state.websocket.attempts + 1,
    },
  }),
}, initialState);
