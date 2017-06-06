import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Text,
  //TextInput,
  View,
  //Animated,
} from 'react-native';

import * as styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class Login extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.emoji}>😎</Text>
          <Text style={styles.logo}>Emoji Salad</Text>
        </View>
        <View style={styles.facebookContainer}>
          { this.props.children }
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
