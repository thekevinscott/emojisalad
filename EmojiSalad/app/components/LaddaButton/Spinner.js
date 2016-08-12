import React from 'react';
import {
  Image,
} from 'react-native';

import {
  styles,
} from './styles';

import img from './images/loading.gif';

export default function Spinner({
  containerWidth,
  isLoading,
}) {
  const spinnerLeftPosition = (containerWidth / 2) - (styles.spinner.width / 2);
  return (
    <Image
      source={img}
      style={{
        ...styles.spinner,
        opacity: isLoading ? 1 : 0,
        left: spinnerLeftPosition,
      }}
    />
  );
}
