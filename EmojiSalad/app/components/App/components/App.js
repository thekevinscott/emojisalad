import React, { Component } from 'react';
import { connect } from 'react-redux';
//import connectWithFocus from '../../../utils/connectWithFocus';
//import codePush from 'react-native-code-push';

import AppProvider from '../../../redux/AppProvider';
import OneSignal from 'react-native-onesignal'; // Import package from node modules

import Routes from './Routes';
import {
  selectMe,
  selectGames,
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

//const codePushOptions = {
  //updateDialog: true,
  //checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
//};

class App extends Component {
  constructor(props) {
    super(props);

    this.receivedPushToken = this.receivedPushToken.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {
    OneSignal.addEventListener('ids', this.receivedPushToken);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.receivedPushToken);
  }

  receivedPushToken({ pushToken, userId }) {
    this.props.actions.savePushId(pushToken, userId);
  }

  render() {
    const state = this.props.store.getState();
    const me = selectMe(state);
    const games = selectGames(state);

    return (
      <AppProvider store={this.props.store}>
        <Routes
          me={me}
          games={games}
        />
      </AppProvider>
    );
  }
}

//export default codePush(codePushOptions)(App);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
