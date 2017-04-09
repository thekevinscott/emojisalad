import React, { PropTypes, Component } from 'react';

import {
  Text,
  View,
} from 'react-native';

import * as styles from '../../styles';

const Instructions = ({
  children,
}) => (
  <View style={styles.instructions}>
    <Text style={styles.text}>{children}</Text>
  </View>
);

Instructions.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Instructions;

