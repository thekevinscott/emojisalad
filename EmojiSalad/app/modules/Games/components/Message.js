import React from 'react';
import {
  Text,
} from 'react-native';

import {
  message as messageStyle,
} from '../styles';

export default function Message({
  body,
}) {
  return (
    <Text
      style={messageStyle}
      numberOfLines={2}
    >
      {body}
    </Text>
  );
}
