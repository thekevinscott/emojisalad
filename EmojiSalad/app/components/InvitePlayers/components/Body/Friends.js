import React from 'react';
import PropTypes from 'prop-types';
import List from 'components/List';
import {
  Text,
} from 'react-native';

import Instructions from './Instructions';
import Friend from './Friend';
import { FriendsPropTypes } from 'app/components/InvitePlayers';

const getInstructions = fetching => {
  if (fetching) {
    return [(
      <Instructions key="fetching" spinner>
        Loading friends 
      </Instructions>
    )];
  }

  return [];
};

const getNothingFound = (fetching, contactsObj) => {
  const contactsExist = Object.keys(contactsObj).reduce((found, key) => {
    return found || contactsObj[key].length > 0;
  }, false);

  if (!contactsExist && !fetching) {
    return [(
      <Instructions key="nothingFound">
        Nobody is found, try modifying your search!
      </Instructions>
    )];
  }

  return [];
};

const getData = (fetching, contacts) => ({
  fetching: getInstructions(fetching),
  friends: contacts.friends.map((friend, key) => (
    <Friend
      key={key}
      friend={friend}
    />
  )),
  invitableFriends: contacts.invitableFriends.map((friend, key) => (
    <Friend
      key={key}
      friend={friend}
    />
  )),
  nothingFound: getNothingFound(fetching, contacts),
});

const defaultHeaders = {
  friends: (
    <Text>Emoji Salad Friends</Text>
  ),
  invitableFriends: (
    <Text>Facebook Friends</Text>
  ),
};

const getHeaders = data => {
  return Object.keys(data).reduce((obj, key) => {
    if (data[key].length) {
      return {
        ...obj,
        [key]: defaultHeaders[key],
      };
    }

    return obj;
  }, {});
};

const Friends = ({
  fetching,
  friends,
  invitableFriends,
  addPlayer,
}) => {
  const data = getData(fetching, {
    friends,
    invitableFriends
  });
  const headers = getHeaders(data);
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
  fetching: PropTypes.bool.isRequired,
  //invitedPlayers: PropTypes.array.isRequired,
  //removePlayer: PropTypes.func.isRequired,
  //startGame: PropTypes.func.isRequired,
  //children: PropTypes.node.isRequired,
};

export default Friends;
