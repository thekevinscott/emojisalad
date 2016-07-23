import React, { Component } from 'react';
import {
  //AppRegistry,
  StyleSheet,
  //Text,
  View
} from 'react-native';

import RegisterContents from '../Register';
const {
  Register,
} = RegisterContents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Register />
      </View>
    );
  }
}

export default App;
