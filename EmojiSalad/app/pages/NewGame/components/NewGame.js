/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  ListView,
  PushNotificationIOS,
  //RefreshControl,
} from 'react-native';

import * as styles from '../styles';

import Body from './Body';
import InvitePlayers from './InvitePlayers/InvitePlayers';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class NewGame extends Component {
  render() {
    const {
      actions,
      me,
      invitedPlayers,
    } = this.props;

    const {
      invitePhoneNumber,
      removePhoneNumber,
      startGame,
    } = actions;

    return (
      <View
        style={styles.newGame}
      >
        <InvitePlayers
          invitePlayer={invitePhoneNumber}
        />
        <Body
          invitedPlayers={invitedPlayers}
          removePlayer={removePhoneNumber}
          startGame={() => {
            startGame(me.key, invitedPlayers.map(player => player.phone));
          }}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewGame);
