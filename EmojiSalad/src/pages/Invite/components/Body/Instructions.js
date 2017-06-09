import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import * as styles from '../../styles';

const Instructions = ({
  children,
  spinner,
}) => (
  <View style={styles.instructions}>
    <View style={styles.instructionsBody}>
      <Text style={styles.text}>{children}</Text>
      { spinner && (
        <ActivityIndicator />
      ) }
    </View>
  </View>
);

Instructions.propTypes = {
  children: PropTypes.node.isRequired,
  spinner: PropTypes.bool,
};

export default Instructions;
