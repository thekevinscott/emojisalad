import React, { Component } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

export default class AppProvider extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <Provider store={this.props.store}>
        {this.props.children}
      </Provider>
    );
  }
}
