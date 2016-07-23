/**
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import AppContents from './app/modules/App';
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
