import React, { PropTypes, Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  constants,
} from 'components/App/styles';

import {
  TouchableHighlight,
} from 'react-native';

const Add = ({
  onPress,
}) => (
  <TouchableHighlight
    onPress={onPress}
  >
    <Icon
      name="ios-add-circle-outline"
      size={30}
      color={constants.purple}
    />
  </TouchableHighlight>
);

Add.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default Add;
