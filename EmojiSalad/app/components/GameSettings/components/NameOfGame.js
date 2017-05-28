import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TextInput,
} from 'react-native';

import * as styles from '../styles';

const NameOfGame = ({
  name,
  onChange,
  placeholder,
}) => {
  return (
    <View style={styles.nameOfGame}>
      <Text style={styles.gameNameLabel}>
        NAME OF GAME
      </Text>
      <TextInput
        placeholder={placeholder}
        style={styles.gameName}
        onChangeText={onChange}
        value={name}
      />
    </View>
  );
}

NameOfGame.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default NameOfGame;
