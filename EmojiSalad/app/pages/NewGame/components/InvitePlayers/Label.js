import React, { PropTypes, Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  Text,
  View,
} from 'react-native';

import * as styles from '../../styles';

const Label = () => (
  <View style={styles.label}>
    <Text style={styles.labelText}>Add:</Text>
  </View>
);

export default Label;
