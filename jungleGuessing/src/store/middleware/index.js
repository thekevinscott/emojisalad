import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import promise from './promise';
import websocket from './websocket';

export default applyMiddleware(
  thunk,
  promise,
  websocket
);
