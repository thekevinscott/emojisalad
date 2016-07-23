import {
  compose,
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';

import promiseMiddleware from 'redux-promise-middleware';
import devTools from 'remote-redux-devtools';

import reducers from './reducer';

export default function configureStore(initialState = {}) {
  const reducer = combineReducers(reducers);

  const middleware = applyMiddleware(
    promiseMiddleware()
  );

  const enhancer = compose(
    middleware,
    devTools()
  );

  return createStore(reducer, initialState, enhancer);

  //const createStoreWithMiddleware = middleware(createStore);
  //return createStoreWithMiddleware(reducer);
}

