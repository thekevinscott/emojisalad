import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

export default class Loading extends Component {
  render() {
    return (
      <View style={{ paddingTop: 40 }}>
        <Text>Loading</Text>
      </View>
    );
  }
}
