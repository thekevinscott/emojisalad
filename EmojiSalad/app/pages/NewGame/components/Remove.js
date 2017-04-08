import React, { PropTypes, Component } from 'react';

import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import {
  constants,
} from 'components/App/styles';

import Icon from 'react-native-vector-icons/Ionicons';

import * as styles from '../styles';

const Remove = ({
  onPress,
}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
    >
      <Icon
        name="ios-remove-circle-outline"
        size={30}
        color={constants.purple}
      />
    </TouchableHighlight>
  );
}

export default Remove;
