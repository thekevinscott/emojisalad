import React, { Component } from 'react';
//import { connect } from 'react-redux';
//import {
  //View,
  //Text,
  //Navigator,
  //TouchableHighlight,
//} from 'react-native';

import AppProvider from '../../../redux/AppProvider';
import AppRouter from './AppRouter';
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
    console.log('App render');

    return (
      <AppProvider store={this.props.store}>
        <AppRouter me={me} />
      </AppProvider>
    );
  }
}
