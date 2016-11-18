import React, { Component } from 'react';
import Raven from 'raven-js';
require('raven-js/plugins/react-native')(Raven);
Raven.config('___PUBLIC_DSN___', { release: '0.4.16' }).install();

import {
  AppRegistry,
  View,
  //Text,
} from 'react-native';

import {
  getStore,
} from 'utils/storage';

import configureStore from './configureStore';

import {
  App,
  Loading,
} from 'components/App';

const style = {
  flex: 1,
};

class EmojiSalad extends Component {
  componentWillMount() {
    this.setState({
      store: null,
    });

    this.getStore();
  }

  getStore() {
    return getStore().then(initialState => {
      if (!this.state.store) {
        this.setState({
          store: configureStore(initialState),
        });
      }
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

    return (<Loading />);
  }

  render() {
    return (
      <View style={style}>
        {this.renderApp()}
      </View>
    );
  }
}

AppRegistry.registerComponent('EmojiSalad', () => EmojiSalad);
