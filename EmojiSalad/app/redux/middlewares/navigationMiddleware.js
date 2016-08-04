import {
  ActionConst,
} from 'react-native-router-flux';

export default function navigationMiddleware({ dispatch }) {
  return next => action => {
    const nextAction = next(action);
    return nextAction;
  };
}

