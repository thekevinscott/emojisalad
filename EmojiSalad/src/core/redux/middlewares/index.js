import {
  applyMiddleware,
} from 'redux';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './storageMiddleware';
import networkMiddleware from './networkMiddleware';
import appqueueMiddleware from './appqueueMiddleware';

const middlewares = [
  thunk,
  promiseMiddleware(),
  storageMiddleware,
  networkMiddleware,
  appqueueMiddleware,
];

const middleware = applyMiddleware(...middlewares);

export default middleware;
