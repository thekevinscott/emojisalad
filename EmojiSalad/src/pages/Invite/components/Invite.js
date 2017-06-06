import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  //Text,
  //View,
  //RefreshControl,
} from 'react-native';

//import * as styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import InvitePlayers, { FriendsPropTypes } from 'app/components/InvitePlayers';

class Invite extends Component {
  static propTypes = {
    //actions: PropTypes.shape({
      //getUserFriends: PropTypes.func.isRequired,
    //}).isRequired,
    me: PropTypes.shape({
      key: PropTypes.string.isRequired,
      facebookToken: PropTypes.string.isRequired,
    }).isRequired,
    fetching: PropTypes.bool.isRequired,
    addPlayer: PropTypes.func.isRequired,
    gameKey: PropTypes.string,
    ...FriendsPropTypes,
  };

  render() {
    return (
      <InvitePlayers
        fetching={this.props.fetching}
        friends={this.props.friends}
        invitableFriends={this.props.invitableFriends}
        addPlayer={this.props.addPlayer}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Invite);
