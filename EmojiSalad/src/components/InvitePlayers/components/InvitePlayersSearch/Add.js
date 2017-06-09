import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

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
    />
  </TouchableHighlight>
);

Add.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default Add;
