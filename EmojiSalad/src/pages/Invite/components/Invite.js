import React from 'react';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import {
  View,
} from 'react-native';

import * as styles from '../styles';

import Friends from './Body/Friends';
import Search from './Search';
import {
  FriendsPropTypes,
} from './propTypes';

const Invite = ({
  onSearch,
  fetching,
  friends,
  invitableFriends,
  addPlayer,
}) => (
  <View
    style={styles.invite}
  >
    <Search
      onChange={onSearch}
      onCancel={() => {
        Actions.pop();
      }}
    />
    <Friends
      fetching={fetching}
      friends={friends}
      invitableFriends={invitableFriends}
      addPlayer={addPlayer}
    />
  </View>
);

Invite.propTypes = {
  addPlayer: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  onSearch: PropTypes.func.isRequired,
  ...FriendsPropTypes,
};

export default Invite;
