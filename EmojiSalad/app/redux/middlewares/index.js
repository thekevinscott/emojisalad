import LogRocket from 'logrocket';

import {
  applyMiddleware,
} from 'redux';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './storageMiddleware';
import networkMiddleware from './networkMiddleware';
import appqueueMiddleware from './appqueueMiddleware';
import pushcityMiddleware from './pushcityMiddleware';

LogRocket.init('q2wtwe/emoji-salad');

const middlewares = [
  thunk,
  promiseMiddleware(),
  pushcityMiddleware,
  storageMiddleware,
  networkMiddleware,
  appqueueMiddleware,
  LogRocket.reduxMiddleware(),
];

const middleware = applyMiddleware(...middlewares);

export default middleware;
