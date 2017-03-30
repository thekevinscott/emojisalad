import React from 'react';
import {
  Animated,
} from 'react-native';

import {
  styles,
} from './styles';

import img from './images/loading.gif';

export default function Spinner({
  isLoading,
  left,
}) {
  return (
    <Animated.Image
      source={img}
      style={{
        ...styles.spinner,
        opacity: isLoading ? 1 : 0,
        left,
      }}
    />
  );
}
