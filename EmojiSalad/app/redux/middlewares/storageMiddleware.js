import {
  setStore,
  getStateParts,
} from '../../utils/storage';

export default function storageMiddleware({ getState }) {
  return next => action => {
    const nextAction = next(action);
    setStore(getStateParts(getState()));
    return nextAction;
  };
}
