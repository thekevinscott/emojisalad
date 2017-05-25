import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
} from 'react-native';

import * as styles from '../styles';

const NameOfGame = ({
  name,
}) => {
  return (
    <View style={styles.nameOfGame}>
      <Text style={styles.gameNameLabel}>
        NAME OF GAME
      </Text>
      <Text style={styles.gameName}>
        { name }
      </Text>
    </View>
  );
}

NameOfGame.propTypes = {
  name: PropTypes.string.isRequired,
};

export default NameOfGame;
