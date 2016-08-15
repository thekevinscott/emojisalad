import checker from './checker';

let store;
const toDispatch = [];

const storeDispatchPayload = payload => {
  toDispatch.push(payload);
};

const dispatchStoredPayloads = () => {
  if (toDispatch.length) {
    while (toDispatch.length) {
      store.dispatch(toDispatch.shift());
    }
  }
};

export const setStore = theStore => {
  store = theStore;
  dispatchStoredPayloads();
};

export const dispatch = payload => {
  if (store) {
    store.dispatch(payload);
  } else {
    storeDispatchPayload(payload);
  }
};

export const getStore = () => {
  return checker({
    check: () => store,
    success: () => {
      return store.getState().router.websocket;
    },
    failure: () => {
      return 'Could not find store in 2 seconds';
    },
  });
};
