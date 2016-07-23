import React, { Component } from 'react';
import {
  //AppRegistry,
  StyleSheet,
  //Text,
  View
} from 'react-native';

class App extends Component {
  render() {
    return (
      <View>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

export default App;
