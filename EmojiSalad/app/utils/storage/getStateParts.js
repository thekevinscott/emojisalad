import {
  WHITELISTED_REDUCERS,
} from './';

const getStateSlice = (state, topKey, stateKey) => {
  if (typeof stateKey === 'string') {
    return {
      slice: state[topKey][stateKey],
      stateKey,
    };
  }

  return {
    slice: stateKey.slice(state[topKey][stateKey.key]),
    stateKey: stateKey.key,
  };
};

function getComponentStatePart(state, topKey) {
  const reducers = WHITELISTED_REDUCERS[topKey];
  // topKey is a top level key on the store, so either ui or data
  return reducers.reduce((obj, key) => {
    const {
      slice,
      stateKey,
    } = getStateSlice(state, topKey, key);
    return {
      ...obj,
      [stateKey]: slice,
    };
  }, {});
}

export default function getStateParts(state) {
  const statePart = Object.keys(WHITELISTED_REDUCERS).reduce((obj, key) => ({
    ...obj,
    [key]: getComponentStatePart(state, key),
  }), {});
  return JSON.stringify(statePart);
}
