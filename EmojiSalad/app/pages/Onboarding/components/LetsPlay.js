import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  TouchableOpacity,
} from 'react-native';

import * as styles from '../styles';

const LetsPlay = ({
  onPress,
  disabled,
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    style={disabled ? styles.disabledButton : styles.button}
  >
    <Text style={styles.buttonText}>
      Let us Play
    </Text>
  </TouchableOpacity>
);

LetsPlay.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default LetsPlay;
