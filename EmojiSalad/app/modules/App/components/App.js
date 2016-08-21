import React, { Component } from 'react';

import AppProvider from '../../../redux/AppProvider';
import Routes from './Routes';
import {
  selectMe,
} from '../selectors';

export default class App extends Component {
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
