import typeToReducer from 'type-to-reducer';
import {
  ActionConst,
} from 'react-native-router-flux';

const initialState = {
  scene: {
    name: 'games',
    key: 'games',
    title: 'Games',
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
}, initialState);
