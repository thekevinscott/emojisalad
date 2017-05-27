import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
} from 'react-native';

import * as styles from '../styles';

import getPlayerString from '../utils/getPlayerString';
import parseTimestamp from '../utils/parseTimestamp';
import { Chevron } from 'components/Icon';

const GameHeader = ({
  players,
  timestamp,
}) => {
  return (
    <View style={styles.rowHeader}>
      <Text
        style={styles.players}
        numberOfLines={1}
      >
        {getPlayerString(players)}
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
  players: PropTypes.array.isRequired,
  timestamp: PropTypes.number,
};

export default GameHeader;
