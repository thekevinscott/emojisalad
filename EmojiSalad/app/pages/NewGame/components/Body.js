import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
} from 'react-native';

import InvitedPlayers from './InvitedPlayers';
import Instructions from './Instructions';

const Body = ({
  invitedPlayers,
  removePlayer,
  startGame,
}) => {
  if (invitedPlayers.length) {
    return (
      <InvitedPlayers
        invitedPlayers={invitedPlayers}
        removePlayer={removePlayer}
        startGame={startGame}
      />
    );
  }

  return (
    <Instructions />
  );
}

InvitedPlayers.PropTypes = {
  invitedPlayers: PropTypes.array.isRequired,
  removePlayer: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
};

export default Body;
