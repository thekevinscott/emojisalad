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
  //hostname: '127.0.0.1',
  //port: '8000',
  hostname: '104.131.180.22',
  port: '5501',
});

export default function configureStore(initialState = {}) {
  const enhancer = composeEnhancers(
    middleware,
  );

  const store = createStore(reducer, initialState, enhancer);

  store.dispatch(updateDeviceInfo());

  return store;
}
