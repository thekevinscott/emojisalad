import {
  applyMiddleware,
} from 'redux';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './storageMiddleware';
import networkMiddleware from './networkMiddleware';
import appqueueMiddleware from './appqueueMiddleware';
import pushcityMiddleware from './pushcityMiddleware';

const middleware = applyMiddleware(
  thunk,
  promiseMiddleware(),
  pushcityMiddleware,
  storageMiddleware,
  networkMiddleware,
  appqueueMiddleware,
);

export default middleware;
