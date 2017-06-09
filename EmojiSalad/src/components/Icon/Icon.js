import React from 'react';
import PropTypes from 'prop-types';
import VectorIcon from 'react-native-vector-icons/Ionicons';

import {
  TouchableHighlight,
  View,
} from 'react-native';

const Wrapper = ({
  children,
  onPress,
}) => {
  if (onPress) {
    return (
      <TouchableHighlight
        onPress={onPress}
      >
        { children }
      </TouchableHighlight>
    );
  }

  return (
    <View>
      { children }
    </View>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
};

const Icon = ({
  icon,
  onPress,
  color,
  size,
}) => (
  <TouchableHighlight
    onPress={onPress}
  >
    <VectorIcon
      name={icon}
      size={size || 30}
      color={color || 'blue'}
    />
  </TouchableHighlight>
);

export const IconPropTypes = {
  onPress: PropTypes.func,
  size: PropTypes.number,
  color: PropTypes.string,
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  ...IconPropTypes,
};

export default Icon;
