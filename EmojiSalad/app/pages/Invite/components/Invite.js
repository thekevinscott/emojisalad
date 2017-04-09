import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  //RefreshControl,
} from 'react-native';

import * as styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import InvitePlayers from 'app/components/InvitePlayers';

class Invite extends Component {
  render() {
    return (
      <InvitePlayers
        submit={phones => {
          this.props.actions.invite(this.props.me.key, this.props.gameKey, phones);
        }}
      >
        Invite a player to this game by entering a phone number above.
      </InvitePlayers>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Invite);
