import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
} from 'react-native';
import {
  getStore,
} from '../utils/storage';
import configureStore from './configureStore';

import AppContents from '../modules/App';
const {
  App,
} = AppContents;

/*
getStore().then(initialState => {
  console.log('got initial state', initialState);
  const store = configureStore(initialState);
  class EmojiSalad extends Component {
    render() {
      return (
        <View>
          <Text>Foo</Text>
        </View>
      );
    }
  }

  AppRegistry.registerComponent('EmojiSalad', () => EmojiSalad);
}).catch(err => {
  console.error('There was an error with the app', err);
});
*/

class EmojiSalad extends Component {
  componentWillMount() {
    getStore().then(initialState => {
      this.setState({
        foo: 'bar',
      });
    });
  }

  render() {
    console.log('STATE', this.state);
    return (
      <View>
        <Text>Foo</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('EmojiSalad', () => EmojiSalad);
