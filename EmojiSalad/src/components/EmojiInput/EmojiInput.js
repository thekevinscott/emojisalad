import React, { Component } from 'react';
//import PropTypes from 'prop-types';
//import { CustomTextInput } from 'react-native-custom-keyboard';

import {
  View,
  Text,
} from 'react-native';

class EmojiInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  onChangeText = text => {
    this.setState({value: text});
  }

  render() {
    return (
      <View>
        <Text>hi</Text>
      </View>
    );
  }
}

export default EmojiInput;
