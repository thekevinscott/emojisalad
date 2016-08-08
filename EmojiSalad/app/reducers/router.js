import typeToReducer from 'type-to-reducer';
import {
  ActionConst,
} from 'react-native-router-flux';

import {
  WEBSOCKET_CONNECT,
} from '../utils/Api/websocket/types';

const initialState = {
  scene: {
    name: 'games',
    key: 'games',
    title: 'Games',
  },
  websocket: {
    connected: false,
  },
};

export default typeToReducer({
  [ActionConst.FOCUS]: (state, { scene }) => ({
    scene: {
      name: scene.name,
      key: scene.sceneKey,
      title: scene.title,
    },
    websocket: state.websocket,
  }),
  [WEBSOCKET_CONNECT]: (state, action) => ({
    scene: state.scene,
    websocket: {
      connected: action.connected,
    },
  }),
}, initialState);
