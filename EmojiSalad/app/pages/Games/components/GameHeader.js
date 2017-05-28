import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
} from 'react-native';

import * as styles from '../styles';

import parseTimestamp from '../utils/parseTimestamp';
import { Chevron } from 'components/Icon';

const GameHeader = ({
  timestamp,
  name,
}) => {
  return (
    <View style={styles.rowHeader}>
      <Text
        style={styles.players}
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text style={styles.timestamp}>
        {parseTimestamp(timestamp)}
      </Text>
      <Chevron
        right
        color="#C7C7CC"
        size={19}
      />
    </View>
  );
}

GameHeader.propTypes = {
  timestamp: PropTypes.number,
  name: PropTypes.string.isRequired,
};

export default GameHeader;
