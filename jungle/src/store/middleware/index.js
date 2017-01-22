import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import promise from './promise';
import websocket from './websocket';
import faker from './faker';

export default applyMiddleware(
  thunk,
  promise,
  websocket,
  faker,
);
