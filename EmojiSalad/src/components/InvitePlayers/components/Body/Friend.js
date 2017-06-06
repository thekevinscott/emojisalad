import React from 'react';
//import PropTypes from 'prop-types';
import {
  Text,
  View,
} from 'react-native';

import {
  FriendPropType,
} from '../InvitePlayers';

import * as styles from '../../styles';

const Friend = ({
  friend,
}) => {
  if (friend.nickname) {
    return (
      <View style={styles.friend}>
        {friend.avatar && (
          <Text style={{
            marginRight: 10,
          }}>
          {`${friend.avatar}`}
        </Text>
        )}
        <Text>
          {`${friend.nickname} (${friend.name})`}
        </Text>
      </View>
    );
  }


  return (
    <View style={styles.friend}>
      <Text>{ friend.name }</Text>
    </View>
  );
};

Friend.propTypes = {
  friend: FriendPropType,
};

export default Friend;
