import React from 'react';
import {
  Bubble,
} from 'react-native-gifted-chat';

import * as styles from './styles';

export default function Message(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: styles.receivedMessage,
        right: styles.sentMessage,
      }}
    />
  );
}
