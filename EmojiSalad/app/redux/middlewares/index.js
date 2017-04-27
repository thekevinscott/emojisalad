import LogRocket from 'logrocket';

import {
  applyMiddleware,
} from 'redux';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './storageMiddleware';
import networkMiddleware from './networkMiddleware';
import appqueueMiddleware from './appqueueMiddleware';

LogRocket.init('q2wtwe/emoji-salad');

const middlewares = [
  thunk,
  promiseMiddleware(),
  storageMiddleware,
  networkMiddleware,
  appqueueMiddleware,
  LogRocket.reduxMiddleware(),
];

const middleware = applyMiddleware(...middlewares);

export default middleware;
