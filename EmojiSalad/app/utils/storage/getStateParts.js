import {
  setStore,
  WHITELISTED_REDUCERS,
} from './';

function getComponentStatePart(state, topKey) {
  // topKey is a top level key on the store, so either ui or data
  return WHITELISTED_REDUCERS[topKey].map((obj, key) => ({
    ...obj,
    [key]: state[topKey][key],
  }), {});
}

export default function getStateParts(state) {
  const statePart = Object.keys(WHITELISTED_REDUCERS).reduce((obj, key) => ({
    ...obj,
    [key]: getComponentStatePart(state, key),
  }), {});
  return JSON.stringify(statePart);
}
