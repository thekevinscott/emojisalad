import React from 'react';
import PropTypes from 'prop-types';

import {
  Animated,
  Text,
  //View,
  //TouchableOpacity,
} from 'react-native';

import Actions from './Actions';

import * as styles from './styles';

const Invite = ({
  confirmInvite,
  cancelInvite,
  invite,
}) => {
  return (
    <Animated.View style={styles.invite}>
      <Text style={styles.inviteText}>{invite.inviter.nickname} invited you to a game!</Text>
      <Actions
        cancelInvite={cancelInvite}
        confirmInvite={confirmInvite}
      />
    </Animated.View>
  );
};

Invite.propTypes = {
  invite: PropTypes.shape({
    inviter: PropTypes.shape({
      nickname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  confirmInvite: PropTypes.func.isRequired,
  cancelInvite: PropTypes.func.isRequired,
};

export default Invite;
