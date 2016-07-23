import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import {
  getStore,
} from '../utils/storage';
import configureStore from './configureStore';

import AppContents from '../modules/App';
const {
  App,
} = AppContents;

getStore().then(initialState => {
  const store = configureStore(initialState);
  class EmojiSalad extends Component {
    render() {
      return (
        <App store={store} />
      );
    }
  }

  AppRegistry.registerComponent('EmojiSalad', () => EmojiSalad);
});
