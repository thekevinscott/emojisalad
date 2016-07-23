import React, { Component } from 'react';

import { Provider } from 'react-redux';

import configureStore from './configureStore';

console.log('wtf', configureStore);

const store = configureStore();

export default class AppProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}
