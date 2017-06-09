import React, { Component } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Authentication from 'core/Authentication';
import Routes from './Routes';
import PushNotificationHandler from './PushNotificationHandler';

import {
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

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const state = this.props.store.getState();
    const me = state.data.me;
    const games = selectGames(state);

    return (
      <Provider store={this.props.store}>
        <PushNotificationHandler
          savePushId={this.props.actions.savePushId}
        >
          <View style={styles.page}>
            <Authentication>
              <Routes
                me={me}
                games={games}
              />
            </Authentication>
          </View>
        </PushNotificationHandler>
      </Provider>
    );
  }
}

//export default codePush(codePushOptions)(App);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
