import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import AppProvider from '../../redux/AppProvider';

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
      <AppProvider>
        <View style={styles.container}>
          <Register />
        </View>
      </AppProvider>
    );
  }
}

export default App;
