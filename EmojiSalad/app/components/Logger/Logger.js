import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

export default class Logger extends Component {
  render() {
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: '#EEE',
          borderTopColor: '#CCCCCC',
          borderTopWidth: 1,
        }}
      >
        <Text>Logger: {this.props.logger}</Text>
      </View>
    );
  }
}
