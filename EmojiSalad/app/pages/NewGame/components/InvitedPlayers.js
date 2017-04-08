import React, { PropTypes, Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import * as styles from '../styles';

import InvitedPlayer from './InvitedPlayer';
import StartGame from './StartGame';

const InvitedPlayers = ({
  invitedPlayers,
  removePlayer,
  startGame,
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
      <StartGame startGame={startGame} />
    </View>
  );
}

InvitedPlayers.PropTypes = {
  invitedPlayers: PropTypes.array.isRequired,
  removePlayer: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
};

export default InvitedPlayers;
