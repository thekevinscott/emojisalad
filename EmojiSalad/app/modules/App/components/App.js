import React, { Component } from 'react';
import codePush from 'react-native-code-push';

import AppProvider from '../../../redux/AppProvider';

import Routes from './Routes';
import {
  selectMe,
} from '../selectors';

const codePushOptions = {
  updateDialog: true,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

class App extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const state = this.props.store.getState();
    const me = selectMe(state);

    return (
      <AppProvider store={this.props.store}>
        <Routes me={me} />
      </AppProvider>
    );
  }
}

export default codePush(codePushOptions)(App);
