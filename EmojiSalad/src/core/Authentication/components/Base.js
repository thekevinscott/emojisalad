import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import graphRequest from './graphRequest';

import {
  View,
} from 'react-native';

class Base extends Component {
  static propTypes = {
    me: PropTypes.shape({
      key: PropTypes.string,
      registered: PropTypes.number.isRequired,
    }).isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.me.key && nextProps.me.key) {
      debugger;
      if (!nextProps.me.registered) {
      }
    }
  }
  render() {
    return (
      <View />
    );
  }
}

export default Base;
