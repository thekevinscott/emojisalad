import React, { Component } from 'react';

import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';

import { Provider } from 'react-redux';
import reducers from './reducer';

const createStoreWithMiddleware = applyMiddleware()(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class AppProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}
