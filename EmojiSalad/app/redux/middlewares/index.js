import {
  applyMiddleware,
} from 'redux';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './storageMiddleware';
import networkMiddleware from './networkMiddleware';
import appqueueMiddleware from './appqueueMiddleware';
//import pushcityMiddleware from './pushcityMiddleware';
import logMiddleware from './logMiddleware';

const middleware = applyMiddleware(
  thunk,
  promiseMiddleware(),
  //pushcityMiddleware,
  storageMiddleware,
  networkMiddleware,
  appqueueMiddleware,
  logMiddleware,
);

export default middleware;
