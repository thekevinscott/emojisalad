import React from 'react';
import PropTypes from 'prop-types';
//import { connect } from 'react-redux';
import {
  //Text,
  //View,
} from 'react-native';

import Friends from './Friends';
import Instructions from './Instructions';
import { FriendsPropTypes } from 'app/components/InvitePlayers';

const Body = ({
  friends,
  invitableFriends,
  addPlayer,
}) => {
  if (friends.length || invitableFriends.length) {
    return (
      <Friends
        friends={friends}
        invitableFriends={invitableFriends}
        addPlayer={addPlayer}
      />
    );
  }

  return (
    <Instructions>
      Loading friends
    </Instructions>
  );
};

Body.propTypes = {
  ...FriendsPropTypes,
  addPlayer: PropTypes.func.isRequired,
  //invitedPlayers: PropTypes.array.isRequired,
  //removePlayer: PropTypes.func.isRequired,
  //startGame: PropTypes.func.isRequired,
  //children: PropTypes.node.isRequired,
};

export default Body;
