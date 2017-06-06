import React, { Component } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Authentication from 'components/Authentication';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import Routes from './Routes';

import {
  selectMe,
  selectGames,
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import {
  View,
} from 'react-native';

import * as styles from '../styles';

class App extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      savePushId: PropTypes.func.isRequired,
    }).isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.receivedPushToken = this.receivedPushToken.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {
    console.log('can this be moved out of the component into the raw javascript?');
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
      <Provider store={this.props.store}>
        <View style={styles.page}>
          <Authentication>
            <Routes
              me={me}
              games={games}
            />
          </Authentication>
        </View>
      </Provider>
    );
  }
}

//export default codePush(codePushOptions)(App);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
