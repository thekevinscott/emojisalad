/**
 * @flow
 */

import React, { Component } from 'react';
import connectWithFocus from '../../../utils/connectWithFocus';
//import { connect } from 'react-redux';
//import Spinner from 'react-native-loading-spinner-overlay';
//import { Logger } from '../../../components/Logger';

import List from './List';
import {
  //Text,
  View,
  ListView,
  PushNotificationIOS,
  //RefreshControl,
} from 'react-native';

import * as styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

class Overview extends Component {
  constructor(props) {
    super(props);
    this.onRegister = this.onRegister.bind(this);
  }

  componentDidMount() {
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('register', this.onRegister);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this.onRegister);
  }

  onRegister(token) {
    this.props.actions.updateDeviceToken(token);
  }

  componentWillAppear({
    type,
  }) {
    console.log('Overview Component componentWillAppear called', type);
    this.props.actions.fetchData(this.props.me.key);
  }

  getData() {
    //console.log('get games', this.props.games);
    return ds.cloneWithRows(this.props.games);
  }

  render() {
    return (
      <View
        style={styles.games}
      >
        <List
          fetching={this.props.ui.fetching}
          games={this.props.games}
          dataSource={this.getData()}
          updateStartingMessage={this.props.actions.updateStartingMessage}
          openGame={this.props.actions.openGame}
        />
      </View>
    );
  }
}

export default connectWithFocus(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
