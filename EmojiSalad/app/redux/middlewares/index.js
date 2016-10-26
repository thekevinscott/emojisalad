import {
  applyMiddleware,
} from 'redux';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './storageMiddleware';
import websocketMiddleware from './websocketMiddleware';
import appqueueMiddleware from './appqueueMiddleware';
import pushcityMiddleware from './pushcityMiddleware';

const middleware = applyMiddleware(
  thunk,
  promiseMiddleware(),
  pushcityMiddleware,
  storageMiddleware,
  websocketMiddleware,
  appqueueMiddleware,
);

export default middleware;
