import React, { Component } from 'react';
//import {
  //View,
  //Text,
  //Navigator,
  //TouchableHighlight,
//} from 'react-native';

import AppProvider from '../../redux/AppProvider';
import AppRouter from './AppRouter';

class App extends Component {
  render() {
    const {
      app,
    } = this.props.store.getState();

    const me = ((app || {}).data || {}).me;

    return (
      <AppProvider store={this.props.store}>
        <AppRouter me={me} />
      </AppProvider>
    );
  }
}

export default App;
