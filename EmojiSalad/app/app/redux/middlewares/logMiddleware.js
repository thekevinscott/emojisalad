import {
  LOGGING,
} from '../../../config';

export default function logMiddleware({
  getState,
}) {
  return next => action => {
    if (LOGGING >= 3) {
      //console.log('before', getState());
      console.log('action', action);
      const nextAction = next(action);
      console.log('after', getState());
      return nextAction;
    }

    return next(action);
  };
}

