import React, { Component } from 'react';

import { Provider } from 'react-redux';

import store from './store';

export default class AppProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}
