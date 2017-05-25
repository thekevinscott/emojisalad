import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
} from 'react-native';

import * as styles from '../styles';

const getName = (name, nickname) => {
  if (nickname) {
    return `${nickname} (${name})`;
  }

  return name;
};

const Player = ({
  player: {
    name,
    nickname,
    avatar,
  },
}) => {
  return (
    <View style={styles.player}>
      <Text style={styles.avatar}>
        { avatar }
      </Text>
      <Text style={styles.nickname}>
        { getName(name, nickname) }
      </Text>
    </View>
  );
}

Player.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
};

export default Player;

