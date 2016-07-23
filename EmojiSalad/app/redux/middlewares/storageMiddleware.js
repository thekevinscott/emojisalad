import {
  setStore,
  WHITELISTED_REDUCERS,
} from '../../utils/storage';

const getStateParts = state => {
  return JSON.stringify(WHITELISTED_REDUCERS.reduce((obj, key) => {
    return {
      ...obj,
      [key]: state[key] || {},
    };
  }, {}));
};

export default function storageMiddleware({ dispatch, getState }) {
  return next => action => {
    const nextAction = next(action);
    setStore(getStateParts(getState()));
    return nextAction;
  };
}

