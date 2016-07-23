/**
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import AppContents from './shared/modules/App';
const {
  App,
} = AppContents;

class EmojiSalad extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('EmojiSalad', () => EmojiSalad);
