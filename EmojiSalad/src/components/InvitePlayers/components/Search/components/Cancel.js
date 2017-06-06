import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  TouchableOpacity,
} from 'react-native';

import * as styles from '../styles';

const Cancel = ({
  onCancel,
}) => {
  return (
    <TouchableOpacity
      onPress={onCancel}
      style={styles.cancel}
    >
      <Text
        style={styles.cancelText}
      >
        Cancel
      </Text>
    </TouchableOpacity>
  );
}

Cancel.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default Cancel;
