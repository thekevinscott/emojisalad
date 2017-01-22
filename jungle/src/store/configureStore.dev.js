import { createStore, compose } from 'redux';
import rootReducer from '../reducers';
import middleware from './middleware';

const finalCreateStore = compose(
  middleware,
  window.devToolsExtension ? window.devToolsExtension() : f => f,
)(createStore);

module.exports = function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
};
