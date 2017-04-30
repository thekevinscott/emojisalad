import React, { PropTypes, Component } from 'react';

import {
  Text,
  View,
} from 'react-native';

import * as styles from '../../styles';
import Remove from './Remove';

const InvitedPlayer = ({
  invitedPlayer: {
    phone,
    name,
  },
  removePlayer
}) => {
  return (
    <View style={styles.invitedPlayer}>
      <Text
        style={styles.invitedPlayerText}
      >
        {name || phone}
      </Text>
      <Remove onPress={removePlayer} />
    </View>
  );
};

InvitedPlayer.PropTypes = {
  invitedPlayer: PropTypes.object.isRequired,
  removePlayer: PropTypes.func.isRequired,
};

export default InvitedPlayer;
