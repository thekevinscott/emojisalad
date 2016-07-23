import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';

import promiseMiddleware from 'redux-promise-middleware';

import reducers from './reducer';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware()
)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default store;
