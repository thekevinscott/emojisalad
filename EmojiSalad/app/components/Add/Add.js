import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  constants,
} from 'components/App/styles';

import {
  TouchableHighlight,
} from 'react-native';

const Add = ({
  onPress,
  color,
}) => (
  <TouchableHighlight
    onPress={onPress}
  >
    <Icon
      name="ios-add-circle-outline"
      size={30}
      color={color || constants.purple}
    />
  </TouchableHighlight>
);

Add.propTypes = {
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
};

export default Add;
