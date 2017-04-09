import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  ListView,
  PushNotificationIOS,
  //RefreshControl,
} from 'react-native';

import * as styles from '../styles';

import Body from './Body/Body';
import InvitePlayersSearch from './InvitePlayersSearch/InvitePlayersSearch';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class InvitePlayers extends Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const {
      actions,
      me,
      invitedPlayers,
      children,
    } = this.props;

    const {
      invitePhoneNumber,
      removePhoneNumber,
      clearInvites,
    } = actions;

    return (
      <View
        style={styles.newGame}
      >
        <InvitePlayersSearch
          invitePlayer={invitePhoneNumber}
        />
        <Body
          invitedPlayers={invitedPlayers}
          removePlayer={removePhoneNumber}
          submit={() => {
            this.props.submit(invitedPlayers.map(player => player.phone));
            clearInvites();
          }}
        >
          { children }
        </Body>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvitePlayers);
