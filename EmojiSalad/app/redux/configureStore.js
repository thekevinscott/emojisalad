import {
  compose,
  createStore,
} from 'redux';

import middleware from './middlewares';
//import devTools from 'remote-redux-devtools';
import { composeWithDevTools } from 'remote-redux-devtools';

import reducer from './reducer';

import {
  updateDeviceInfo,
} from 'utils/device/actions';

const composeEnhancers = composeWithDevTools({
  realtime: true,
  name: 'Emoji Salad App',
  sendOnError: 1,
});

export default function configureStore(initialState = {}) {
  const enhancer = composeEnhancers(
    middleware,
  );

  const store = createStore(reducer, initialState, enhancer);

  store.dispatch(updateDeviceInfo());

  return store;
}
