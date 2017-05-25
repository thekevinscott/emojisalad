import React from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
} from 'react-native';

import * as styles from '../styles';

const Row = ({
  data,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
    >
      { data }
    </TouchableOpacity>
  );
}

Row.propTypes = {
  data: PropTypes.any.isRequired,
  onPress: PropTypes.func,
};

export default Row;
