import React from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  View,
} from 'react-native';

import * as styles from '../styles';

const getStyle = noRowPadding => {
  if (noRowPadding) {
    return {
      ...styles.row,
      padding: 0,
    };
  }

  return styles.row;
};

const Row = ({
  data,
  onPress,
  noRowPadding,
}) => {
  const style = getStyle(noRowPadding);
  if (onPress) {
    return (
      <TouchableOpacity
        style={style}
        onPress={onPress}
      >
        { data }
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={style}
    >
      { data }
    </View>
  );
}

Row.propTypes = {
  data: PropTypes.any.isRequired,
  onPress: PropTypes.func,
  noRowPadding: PropTypes.bool.isRequired,
};

export default Row;
