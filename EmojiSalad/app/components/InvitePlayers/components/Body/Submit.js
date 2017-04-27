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

import * as styles from '../../styles';

const Submit = ({
  submit,
}) => {
  return (
    <View style={styles.startGame}>
      <TouchableHighlight
        onPress={submit}
      >
        <Icon
          name="ios-checkmark-circle"
          size={60}
          color={constants.purple}
        />
      </TouchableHighlight>
    </View>
  );
};

export default Submit;