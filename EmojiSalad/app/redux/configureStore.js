import {
  compose,
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';

import promiseMiddleware from 'redux-promise-middleware';
import storageMiddleware from './middlewares/storageMiddleware';
import devTools from 'remote-redux-devtools';

import reducers from './reducer';

export default function configureStore(initialState = {}) {
  const reducer = combineReducers(reducers);

  const middleware = applyMiddleware(
    promiseMiddleware(),
    storageMiddleware
  );

  const enhancer = compose(
    middleware,
    devTools()
  );

  return createStore(reducer, initialState, enhancer);

  //const createStoreWithMiddleware = middleware(createStore);
  //return createStoreWithMiddleware(reducer);
}

