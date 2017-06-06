import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import EmojiPicker from 'react-native-simple-emoji-picker';

import {
  View,
  Button,
  //Text,
  TextInput,
} from 'react-native';

import * as styles from '../styles';

class AvatarPicker extends Component {
  static propTypes = {
    value: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      focus: false,
    };

    this.focus = this.focus.bind(this);
    this.pick = this.pick.bind(this);
  }

  focus() {
    this.setState({
      focus: true,
    });
  }

  pick(emoji) {
    console.log('emoji', emoji);
    this.setState({
      focus: false,
    });
  }

  render() {
    return (
      <View>
        <TextInput
          style={styles.avatar}
          value={this.props.value}
        />
        <Button
          style={styles.pickEmoji}
          title="Pick a different emoji"
          onPress={this.focus}
        />
      </View>
    );
  }
}

export default AvatarPicker;
