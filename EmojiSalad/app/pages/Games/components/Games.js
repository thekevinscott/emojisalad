import React, { Component } from 'react';
import {
  Actions,
} from 'react-native-router-flux';
import PropTypes from 'prop-types';
import connectWithFocus from '../../../utils/connectWithFocus';
//import { connect } from 'react-redux';
//import Spinner from 'react-native-loading-spinner-overlay';
//import { Logger } from '../../../components/Logger';

import List from './List';
import {
  //Text,
  View,
  ListView,
  //PushNotificationIOS,
  //Alert,
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

class Games extends Component {
  static propTypes = {
    fetching: PropTypes.bool.isRequired,
    games: PropTypes.arrayOf(PropTypes.shape({
    })).isRequired,
    me: PropTypes.shape({
      key: PropTypes.string.isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      fetchData: PropTypes.func.isRequired,
      openGame: PropTypes.func.isRequired,
      pauseGame: PropTypes.func.isRequired,
      leaveGame: PropTypes.func.isRequired,
      updateStartingMessage: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.games.length === 0) {
      Actions.newGame();
    }
  }

  componentWillAppear({
    type,
  }) {
    console.log('Overview Component componentWillAppear called', type);
    this.props.actions.fetchData(this.props.me.key);
  }

  getData() {
    return ds.cloneWithRows(this.props.games);
  }

  render() {
    return (
      <View
        style={styles.games}
      >
        <List
          fetching={this.props.fetching}
          games={this.props.games}
          dataSource={this.getData()}
          updateStartingMessage={this.props.actions.updateStartingMessage}
          openGame={this.props.actions.openGame}
          pauseGame={game => {
            this.props.actions.pauseGame(this.props.me, game);
          }}
          leaveGame={game => {
            this.props.actions.leaveGame(this.props.me, game);
          }}
        />
      </View>
    );
  }
}

export default connectWithFocus(
  mapStateToProps,
  mapDispatchToProps
)(Games);
