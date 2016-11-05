import { createStore, compose } from 'redux';
import rootReducer from '../reducers';
import middleware from './middleware';

const finalCreateStore = compose(
  middleware
)(createStore);

module.exports = function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState);
};
