import React, { PropTypes, Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import * as styles from '../../styles';

import InvitedPlayer from './InvitedPlayer';
import Submit from './Submit';

const InvitedPlayers = ({
  invitedPlayers,
  removePlayer,
  submit,
}) => {
  return (
    <View style={styles.invitedPlayers}>
      {invitedPlayers.map(invitedPlayer => (
        <InvitedPlayer
          key={invitedPlayer.phone}
          invitedPlayer={invitedPlayer}
          removePlayer={() => {
            removePlayer(invitedPlayer);
          }}
        />
      ))}
      <Submit submit={submit} />
    </View>
  );
}

InvitedPlayers.PropTypes = {
  invitedPlayers: PropTypes.array.isRequired,
  removePlayer: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};

export default InvitedPlayers;
