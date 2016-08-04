import {
  ActionConst,
} from 'react-native-router-flux';

export default function storageMiddleware() {
  return next => action => {
    if (action.type === ActionConst.FOCUS) {
      const {
        component,
        //name,
        //sceneKey,
        //title,
      } = action.scene;

      console.log('component', component);
      console.log('this is where i want to access component willFocus, and I think I can do that by getting component.getWrappedInstance(), but I need to do that via a ref to that component');
    }

    const nextAction = next(action);
    return nextAction;
  };
}

