import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
} from 'react-native';

import * as styles from '../styles';

const getName = (name, nickname) => {
  return [name, nickname].filter(str => str).map((str, index) => {
    if (index > 0) {
      return `(${str})`;
    }

    return str;
  }).join(' ');
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
      <Text style={styles.status}>
        Pending
      </Text>
    </View>
  );
}

Player.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string,
    nickname: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
};

export default Player;

