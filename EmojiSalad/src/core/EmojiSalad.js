import React, { Component } from 'react';
import logging from 'utils/logging';

import {
  getStore,
} from 'utils/storage';

import Splash from 'pages/Splash';

import configureStore from 'core/redux/configureStore';

import App from 'core/App';

// Component for rendering app, only once store
// is loaded from localStore
class EmojiSalad extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.getStore = this.getStore.bind(this);
  }

  componentWillMount() {
    this.getStore();
  }

  getStore() {
    return getStore().then(initialState => {
      if (!this.state.store) {
        logging.setUser(initialState.data.me);

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

  render() {
    if (this.state.store) {
      return (
        <App store={this.state.store} />
      );
    }

    return (
      <Splash />
    );
  }
}

export default EmojiSalad;
