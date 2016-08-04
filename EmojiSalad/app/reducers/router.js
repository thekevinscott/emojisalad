import typeToReducer from 'type-to-reducer';
import {
  ActionConst,
} from 'react-native-router-flux';

import {
  WEBSOCKET_CONNECT,
} from '../utils/Api/websocket/types';

const initialState = {
  scene: {
    name: null,
    key: null,
    title: null,
  },
  websocket: {
    connected: false,
  },
};

export default typeToReducer({
  [ActionConst.FOCUS]: (state, { scene }) => ({
    ...state.websocket,
    scene: {
      name: scene.name,
      key: scene.sceneKey,
      title: scene.title,
    },
  }),
  [WEBSOCKET_CONNECT]: (state, action) => ({
    ...state.scene,
    websocket: {
      connected: action.connected,
    },
  }),
}, initialState);
