import React from 'react';
import PropTypes from 'prop-types';
import List from 'components/List';
import {
  Text,
} from 'react-native';

import Friend from './Friend';
import { FriendsPropTypes } from 'app/components/InvitePlayers';

const getData = (friends, invitableFriends) => ({
  emojiSaladFriends: friends.map((friend, key) => (
    <Friend
      key={key}
      friend={friend}
    />
  )),
  //facebookFriends: invitableFriends.map((friend, key) => (
    //<Friend
      //key={key}
      //friend={friend}
    ///>
  //)),
});

const headers = {
  emojiSaladFriends: (
    <Text>Emoji Salad Friends</Text>
  ),
  facebookFriends: (
    <Text>Facebook Friends</Text>
  ),
};

const Friends = ({
  friends,
  invitableFriends,
  addPlayer,
}) => {
  const data = getData(friends, invitableFriends);
  return (
    <List
      onPress={({ props }) => {
        addPlayer(props.friend);
      }}
      data={data}
      headers={headers}
    />
  );
};

Friends.propTypes = {
  ...FriendsPropTypes,
  addPlayer: PropTypes.func.isRequired,
  //invitedPlayers: PropTypes.array.isRequired,
  //removePlayer: PropTypes.func.isRequired,
  //startGame: PropTypes.func.isRequired,
  //children: PropTypes.node.isRequired,
};

export default Friends;
