import React from 'react';
import PropTypes from 'prop-types';
//import { connect } from 'react-redux';
import {
  //Text,
  //View,
} from 'react-native';

import Friends from './Friends';
import { FriendsPropTypes } from 'app/components/InvitePlayers';

const Body = ({
  fetching,
  friends,
  invitableFriends,
  addPlayer,
}) => {
  return (
    <Friends
      fetching={fetching}
      friends={friends}
      invitableFriends={invitableFriends}
      addPlayer={addPlayer}
    />
  );
};

Body.propTypes = {
  ...FriendsPropTypes,
  addPlayer: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

export default Body;
