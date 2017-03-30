import React from 'react';
import {
  Bubble,
} from 'react-native-gifted-chat';

import * as styles from './styles';

const getRightStyle = type => {
  return (type === 'pending') ? styles.pendingMessage : styles.sentMessage;
};

export default function Message(props) {
  const {
    currentMessage,
  } = props;

  const right = getRightStyle(currentMessage.type);

  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: styles.receivedMessage,
        right,
      }}
    />
  );
}
