import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import promise from './promise';

export default applyMiddleware(
  thunk,
  promise,
);
