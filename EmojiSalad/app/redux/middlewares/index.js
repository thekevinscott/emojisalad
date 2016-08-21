import {
  applyMiddleware,
} from 'redux';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './storageMiddleware';
import websocketMiddleware from './websocketMiddleware';
import appqueueMiddleware from './appqueueMiddleware';
import navigationMiddleware from './navigationMiddleware';

const middleware = applyMiddleware(
  thunk,
  promiseMiddleware(),
  storageMiddleware,
  websocketMiddleware,
  navigationMiddleware,
  appqueueMiddleware,
);

export default middleware;
