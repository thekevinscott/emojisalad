import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { register, insertText } from 'react-native-custom-keyboard';

class EmojiKeyboard extends Component {
  static propTypes = {
    tag: PropTypes.any,
  };

  onPress = () => {
    insertText(this.props.tag, 'Hello, world');
  };
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <Text>Hello, world</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

register('emoji', () => EmojiKeyboard);
