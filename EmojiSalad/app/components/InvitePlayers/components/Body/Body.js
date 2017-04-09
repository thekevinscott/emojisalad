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
  submit,
  children,
}) => {
  if (invitedPlayers.length) {
    return (
      <InvitedPlayers
        invitedPlayers={invitedPlayers}
        removePlayer={removePlayer}
        submit={submit}
      />
    );
  }

  return (
    <Instructions>{ children }</Instructions>
  );
}

InvitedPlayers.PropTypes = {
  invitedPlayers: PropTypes.array.isRequired,
  removePlayer: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Body;
