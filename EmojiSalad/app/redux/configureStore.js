import {
  compose,
  createStore,
  applyMiddleware,
} from 'redux';

import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './middlewares/storageMiddleware';
import websocketMiddleware from './middlewares/websocketMiddleware';
import devTools from 'remote-redux-devtools';

import reducer from './reducer';

import {
  configureWebsocket,
} from '../utils/Api/websocket';

export default function configureStore(initialState = {}) {
  const middleware = applyMiddleware(
    promiseMiddleware(),
    storageMiddleware,
    websocketMiddleware
  );

  const enhancer = compose(
    middleware,
    devTools()
  );

  const store = createStore(reducer, initialState, enhancer);

  configureWebsocket(store);

  return store;
}

