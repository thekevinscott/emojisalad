/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  App,
} from './shared/modules/App';

class EmojiSalad extends Component {
  render() {
    return (
      <App>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to React Nativeeeeeee!
          </Text>
        </View>
      </App>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('EmojiSalad', () => EmojiSalad);
