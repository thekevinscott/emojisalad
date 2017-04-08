/**
 * @flow
 */

import React, { Component } from 'react';

import {
  Text,
  View,
} from 'react-native';

import * as styles from '../styles';

class Instructions extends Component {
  render() {
    return (
      <View style={styles.instructions}>
        <Text style={styles.text}>Start a new game by inviting players by their phone numbers above.</Text>
      </View>
    );
  }
}

export default Instructions;

