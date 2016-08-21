import React, { Component } from 'react';
import moment from 'moment';
import {
  Text,
  View,
} from 'react-native';

const getText = (messages = []) => {
  return messages.map(message => {
    if (typeof message === 'string') {
      return message;
    }

    const t = moment(message.timestamp);
    return `${t.format('HH:mm:ss.SSS a')}: ${message.message}`;
  }).join('\n\n');
};

export default class Logger extends Component {
  render() {
    const text = getText(this.props.logger);
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: '#EEE',
          borderTopColor: '#CCCCCC',
          borderTopWidth: 1,
        }}
      >
        <Text>{text}</Text>
      </View>
    );
  }
}
