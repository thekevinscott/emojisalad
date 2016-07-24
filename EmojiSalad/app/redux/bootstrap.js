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
*/

class EmojiSalad extends Component {
  componentWillMount() {
    this.setState({
      store: null,
    });

    this.getStore();
  }

  getStore() {
    return getStore().then(initialState => {
      this.setState({
        store: configureStore(initialState),
      });
    }).catch(err => {
      this.setState({
        store: configureStore({}),
      });
      console.log('Error getting initial state', err);
    });
  }

  renderApp() {
    if (this.state.store) {
      return (
        <App store={this.state.store} />
      );
    }

    return (
      <View style={{ paddingTop: 40 }}>
        <Text>Loading</Text>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.renderApp()}
      </View>
    );
  }
}

AppRegistry.registerComponent('EmojiSalad', () => EmojiSalad);
