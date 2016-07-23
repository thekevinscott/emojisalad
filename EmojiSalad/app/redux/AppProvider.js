import React, { Component } from 'react';
import { Provider } from 'react-redux';

export default class AppProvider extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        {this.props.children}
      </Provider>
    );
  }
}
