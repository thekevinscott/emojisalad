import React from 'react';

import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import * as styles from '../styles';

const Separator = ({
  sectionID,
  rowID,
  adjacentRowHighlighted,
}) => (
  <View
    key={`${sectionID}-${rowID}`}
    style={styles.rowSeparator(adjacentRowHighlighted)}
  />
);

export default Separator;
