/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    height: 40,
    textAlign: 'center',
    backgroundColor: '#CCC',
    margin: 10,
  },
});

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleChangeText = this.handleChangeText.bind(this);
  }

  handleChangeText(text) {
    console.log('text', text);
    this.setState({
      text,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Wussup. Enter your phone number to migrate over.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Type your phone number here"
          onChangeText={this.handleChangeText}
        />
      </View>
    );
  }
}

export default Register;
