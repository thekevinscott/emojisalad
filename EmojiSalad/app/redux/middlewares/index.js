import {
  applyMiddleware,
} from 'redux';

import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './storageMiddleware';
import websocketMiddleware from './websocketMiddleware';
import navigationMiddleware from './navigationMiddleware';

const middleware = applyMiddleware(
  promiseMiddleware(),
  storageMiddleware,
  websocketMiddleware,
  navigationMiddleware,
);

export default middleware;
