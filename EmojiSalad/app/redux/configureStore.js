import {
  compose,
  createStore,
} from 'redux';

import middleware from './middlewares';
import devTools from 'remote-redux-devtools';

import reducer from './reducer';

import {
  configureWebsocket,
} from '../utils/Api/websocket';

export default function configureStore(initialState = {}) {
  const enhancer = compose(
    middleware,
    devTools({
      name: 'iOS',
      realtime: true,
      //hostname: '',
      //port: '',
      sendOnError: 1,
    })
  );

  const store = createStore(reducer, initialState, enhancer);

  configureWebsocket(store);

  return store;
}

