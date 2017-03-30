import React, { Component } from 'react';
import Raven from 'raven-js';
require('raven-js/plugins/react-native')(Raven);

import { INFO } from 'app/utils/device';

Raven.config('https://32267e621577475095319f5baf4c837b@sentry.io/115596', {
  release: INFO.readableAppVersion,
}).install();

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
        Raven.setUser({
          key: initialState.data.me.key,
          nickname: initialState.data.me.nickname,
        });

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
