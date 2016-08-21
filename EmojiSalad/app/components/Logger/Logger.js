import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

export default class Logger extends Component {
  render() {
    const text = (this.props.logger || []).join('\n\n');
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: '#EEE',
          borderTopColor: '#CCCCCC',
          borderTopWidth: 1,
        }}
      >
        <Text>Logger: {text}</Text>
      </View>
    );
  }
}
