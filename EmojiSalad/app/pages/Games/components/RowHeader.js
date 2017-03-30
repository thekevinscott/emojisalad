import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import * as styles from '../styles';

import getPlayerString from '../utils/getPlayerString';
import parseTimestamp from '../utils/parseTimestamp';

export default function RowHeader({
  players,
  timestamp,
}) {
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
    </View>
  );
}
