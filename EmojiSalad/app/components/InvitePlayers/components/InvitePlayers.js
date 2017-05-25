import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  //Text,
  View,
  //ListView,
  //PushNotificationIOS,
  //RefreshControl,
} from 'react-native';

import * as styles from '../styles';

import Body from './Body/Body';
import InvitePlayersSearch from './InvitePlayersSearch/InvitePlayersSearch';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

export const FriendPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const FriendsPropTypes = {
  friends: PropTypes.arrayOf(FriendPropType).isRequired,
  invitableFriends: PropTypes.arrayOf(FriendPropType).isRequired,
};

class InvitePlayers extends Component {
  static propTypes = {
    addPlayer: PropTypes.func.isRequired,
    ...FriendsPropTypes,
  };

  render() {
    const {
      friends,
      invitableFriends,
      addPlayer,
    } = this.props;

    return (
      <View
        style={styles.newGame}
      >
        <InvitePlayersSearch
          invitePlayer={() => {
          }}
        />
        <Body
          friends={friends}
          invitableFriends={invitableFriends}
          addPlayer={addPlayer}
        >
        </Body>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvitePlayers);
