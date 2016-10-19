import React from 'react';
import {
  View,
} from 'react-native';

import * as styles from './styles';

export default function Status({
  children,
}: {
  children: any,
}) {
  return (
    <View
      style={styles.status}
    >
      {children}
    </View>
  );
}

