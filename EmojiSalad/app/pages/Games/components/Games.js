import React, { Component } from 'react';
//import { Actions, } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import connectWithFocus from '../../../utils/connectWithFocus';

import Body from './Body';
import Game from './Game';
import Invite from './Invite';
import {
  //Text,
  View,
  //Alert,
  //BodyView,
  //PushNotificationIOS,
  //Alert,
  //RefreshControl,
} from 'react-native';

import * as styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class Games extends Component {
  static propTypes = {
    fetching: PropTypes.bool.isRequired,
    invites: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
    })).isRequired,
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
      confirmInvite: PropTypes.func.isRequired,
      cancelInvite: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //if (this.props.games.length === 0) {
      //Actions.newGame();
    //}
  }

  componentWillAppear({
    type,
  }) {
    console.log('Overview Component componentWillAppear called', type);
    this.props.actions.fetchData(this.props.me.key);
  }

  render() {
    const {
      invites,
      me,
      games,
      actions: {
        cancelInvite,
        confirmInvite,
        openGame,
        updateStartingMessage,
      },
    } = this.props;

    const data = {
      'invites': invites.map(invite => {
        return (
          <Invite
            key={invite.key}
            invite={invite}
            cancelInvite={() => {
              cancelInvite(me.key, invite);
            }}
            confirmInvite={() => {
              confirmInvite(me.key, invite);
            }}
          />
        );
      }),
      'games': games.map(game => {
        return (
          <Game
            key={game.key}
            game={game}
            openGame={() => {
              openGame(game, games);
            }}
            updateStartingMessage={updateStartingMessage}
          />
        );
      }),
    };

    return (
      <View
        style={styles.games}
      >
        <Body
          data={data}
          fetching={this.props.fetching}
          games={this.props.games}
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
