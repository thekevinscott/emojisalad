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

const devToolOptions = {
  //realtime: true,
  name: 'Emoji Salad App',
  //sendOnError: 1,
  //hostname: 'localhost',
  //port: '5501',
};

const composeEnhancers = composeWithDevTools(devToolOptions);

export default function configureStore(initialState = {}) {
  const enhancer = composeEnhancers(
    middleware,
  );

  const store = createStore(reducer, initialState, enhancer);

  store.dispatch(updateDeviceInfo());

  return store;
}
